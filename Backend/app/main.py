from fastapi import FastAPI, Depends, HTTPException, Query, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
import os

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.database import get_db, engine
from db import models
from app import schemas
from app.security import require_admin

# create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio API")

# --- Rate limiting (protects free-tier DB compute-hours from abuse) ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- Response compression ---
app.add_middleware(GZipMiddleware, minimum_size=500)

# Comma-separated list of allowed origins, e.g.
# "https://mahfuj-portfolio.vercel.app,http://localhost:5173"
_allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:4000, https://md-mahfujur-rahman.vercel.app",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _allowed_origins if o.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# How long browsers/CDNs may cache public read endpoints before revalidating.
_LIST_CACHE = "public, max-age=300, stale-while-revalidate=60"
_DETAIL_CACHE = "public, max-age=600, stale-while-revalidate=120"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/v1/profile", response_model=schemas.ProfileOut)
def get_profile(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = _DETAIL_CACHE
    profile = db.query(models.Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@app.put("/api/v1/profile", response_model=schemas.ProfileOut)
def upsert_profile(data: schemas.ProfileOut, db: Session = Depends(get_db), _=Depends(require_admin)):
    profile = db.query(models.Profile).first()
    if not profile:
        profile = models.Profile(**data.dict())
        db.add(profile)
    else:
        for k, v in data.dict().items():
            setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile


@app.get("/api/v1/projects", response_model=List[schemas.ProjectListItem])
def list_projects(
    response: Response,
    limit: int = Query(10, ge=1, le=1000),
    offset: int = 0,
    techStack: Optional[str] = None,
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = _LIST_CACHE
    q = db.query(models.Project)
    if techStack:
        q = q.filter(models.Project.tech_stack.any(techStack))
    projects = q.offset(offset).limit(limit).all()
    return projects


@app.post("/api/v1/projects", response_model=schemas.ProjectOut)
def create_project(payload: schemas.ProjectCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    obj = models.Project(**payload.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.get("/api/v1/projects/{slug}", response_model=schemas.ProjectOut)
def get_project(slug: str, response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = _DETAIL_CACHE
    project = db.query(models.Project).filter_by(slug=slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.put("/api/v1/projects/{slug}", response_model=schemas.ProjectOut)
def update_project(slug: str, payload: schemas.ProjectCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    project = db.query(models.Project).filter_by(slug=slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in payload.dict().items():
        setattr(project, k, v)
    db.commit()
    db.refresh(project)
    return project


@app.delete("/api/v1/projects/{slug}")
def delete_project(slug: str, db: Session = Depends(get_db), _=Depends(require_admin)):
    project = db.query(models.Project).filter_by(slug=slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"success": True}


@app.get("/api/v1/publications", response_model=List[schemas.PublicationListItem])
def list_publications(response: Response, limit: int = Query(10, ge=1, le=1000), offset: int = 0, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = _LIST_CACHE
    pubs = db.query(models.Publication).offset(offset).limit(limit).all()
    return pubs


@app.post("/api/v1/publications", response_model=schemas.PublicationOut)
def create_publication(payload: schemas.PublicationCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    obj = models.Publication(**payload.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.get("/api/v1/publications/{slug}", response_model=schemas.PublicationOut)
def get_publication(slug: str, response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = _DETAIL_CACHE
    pub = db.query(models.Publication).filter_by(slug=slug).first()
    if not pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    return pub


@app.get("/api/v1/publications/{slug}/neighbors", response_model=schemas.PublicationNeighbors)
def get_publication_neighbors(slug: str, response: Response, db: Session = Depends(get_db)):
    """Lightweight previous/next lookup.

    Replaces the frontend's old pattern of fetching up to 200 full
    publication rows just to render a prev/next link on the detail page.
    """
    response.headers["Cache-Control"] = _LIST_CACHE
    rows = (
        db.query(models.Publication.id, models.Publication.slug, models.Publication.title)
        .order_by(models.Publication.year.desc(), models.Publication.id.desc())
        .all()
    )
    idx = next((i for i, r in enumerate(rows) if r.slug == slug), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Publication not found")
    prev_row = rows[idx - 1] if idx > 0 else None
    next_row = rows[idx + 1] if idx < len(rows) - 1 else None
    return schemas.PublicationNeighbors(
        previous=schemas.PublicationNeighbor(slug=prev_row.slug, title=prev_row.title) if prev_row else None,
        next=schemas.PublicationNeighbor(slug=next_row.slug, title=next_row.title) if next_row else None,
    )


@app.put("/api/v1/publications/{slug}", response_model=schemas.PublicationOut)
def update_publication(slug: str, payload: schemas.PublicationCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    pub = db.query(models.Publication).filter_by(slug=slug).first()
    if not pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    for k, v in payload.dict().items():
        setattr(pub, k, v)
    db.commit()
    db.refresh(pub)
    return pub


@app.delete("/api/v1/publications/{slug}")
def delete_publication(slug: str, db: Session = Depends(get_db), _=Depends(require_admin)):
    pub = db.query(models.Publication).filter_by(slug=slug).first()
    if not pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    db.delete(pub)
    db.commit()
    return {"success": True}


@app.get("/api/v1/blogs", response_model=List[schemas.BlogOut])
def list_blogs(response: Response, limit: int = Query(10, ge=1, le=50), offset: int = 0, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = _LIST_CACHE
    blogs = db.query(models.Blog).offset(offset).limit(limit).all()
    return blogs


@app.post("/api/v1/blogs", response_model=schemas.BlogOut)
def create_blog(payload: schemas.BlogCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    obj = models.Blog(**payload.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@app.get("/api/v1/blogs/{slug}", response_model=schemas.BlogOut)
def get_blog(slug: str, response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = _DETAIL_CACHE
    blog = db.query(models.Blog).filter_by(slug=slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


@app.post("/api/v1/blogs/{blog_id}/comments", response_model=schemas.CommentOut, status_code=201)
@limiter.limit("10/minute")
def post_comment(request: Request, blog_id: int, payload: schemas.CommentCreate, db: Session = Depends(get_db)):
    # Public endpoint (visitors post comments), rate-limited instead of admin-gated.
    blog = db.query(models.Blog).filter_by(id=blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    comment = models.BlogComment(blog_id=blog_id, **payload.dict())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@app.get("/api/v1/blogs/{blog_id}/comments", response_model=List[schemas.CommentOut])
def get_comments(blog_id: int, limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter_by(id=blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    comments = db.query(models.BlogComment).filter_by(blog_id=blog_id).offset(offset).limit(limit).all()
    return comments


@app.post("/api/v1/blogs/{blog_id}/comments/{comment_id}/replies", response_model=schemas.CommentOut, status_code=201)
@limiter.limit("10/minute")
def post_reply(request: Request, blog_id: int, comment_id: int, payload: schemas.CommentCreate, db: Session = Depends(get_db)):
    # Public endpoint (visitors reply to comments), rate-limited instead of admin-gated.
    parent = db.query(models.BlogComment).filter_by(id=comment_id, blog_id=blog_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent comment not found")
    reply = models.BlogComment(blog_id=blog_id, parent_id=comment_id, **payload.dict())
    db.add(reply)
    db.commit()
    db.refresh(reply)
    return reply


@app.get("/api/v1/skills")
def get_skills(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = _LIST_CACHE
    # selectinload eager-loads all categories' skills in a single extra query
    # instead of one query per category (N+1).
    cats = (
        db.query(models.SkillCategory)
        .options(selectinload(models.SkillCategory.skills))
        .order_by(models.SkillCategory.id.asc())
        .all()
    )
    result = []
    for c in cats:
        result.append({"category": c.name, "skills": [{"name": s.name, "level": s.level} for s in c.skills]})
    return {"data": result}


@app.post("/api/v1/skills/categories", status_code=201)
def create_skill_category(payload: schemas.SkillCategoryCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    c = models.SkillCategory(name=payload.name)
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "name": c.name}


@app.post("/api/v1/skills", status_code=201)
def create_skill(payload: schemas.SkillCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    s = models.Skill(**payload.dict())
    db.add(s)
    db.commit()
    db.refresh(s)
    return {"id": s.id, "name": s.name, "level": s.level}


@app.get("/api/v1/achievements")
def list_achievements(response: Response, limit: int = Query(20, le=100), offset: int = 0, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = _LIST_CACHE
    items = db.query(models.Achievement).offset(offset).limit(limit).all()
    return items


@app.post("/api/v1/achievements", status_code=201)
def create_achievement(payload: schemas.AchievementCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    a = models.Achievement(**payload.dict())
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@app.get("/api/v1/contact/comments")
def get_contact_comments(limit: int = 10, offset: int = 0, db: Session = Depends(get_db)):
    items = db.query(models.ContactComment).offset(offset).limit(limit).all()
    return items


@app.post("/api/v1/contact")
@limiter.limit("5/minute")
def submit_contact(
    request: Request,
    payload: schemas.ContactMessageCreate,
    db: Session = Depends(get_db),
):
    try:
        msg = models.ContactMessage(
            name=payload.name,
            email=payload.email,
            message=payload.message,
        )

        db.add(msg)
        db.commit()
        db.refresh(msg)

        return {
            "success": True,
            "id": str(msg.id),
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/predict")
def predict_placeholder():
    return {"error": "Predict endpoint placeholder - implement model serving separately"}
