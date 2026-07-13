from __future__ import annotations
from typing import List, Optional, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime


def to_camel(string: str) -> str:
    parts = string.split("_")
    return parts[0] + "".join(x.capitalize() or "" for x in parts[1:])


class ProfileOut(BaseModel):
    name: str
    tagline: Optional[str]
    headline: Optional[str]
    impact_statement: Optional[str]
    bio: Optional[str]
    profile_image: Optional[str]
    resume_url: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    location: Optional[str]
    social_links: Optional[list]
    contact_cta: Optional[str]

    model_config = {"from_attributes": True, "alias_generator": to_camel, "populate_by_name": True}


class ProjectBase(BaseModel):
    slug: str
    title: str
    summary: Optional[str]
    tech_stack: Optional[List[str]] = []
    github_url: Optional[str]
    live_demo_url: Optional[str]
    image_url: Optional[str]


class ProjectCreate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    id: int
    # include all detail fields stored in DB so project detail by slug returns full data
    problem_statement: Optional[str]
    dataset: Optional[Any]
    model: Optional[Any]
    system_architecture: Optional[str]
    metrics: Optional[Any]
    deployment: Optional[Any]
    optimization: Optional[List[str]]
    challenges: Optional[List[str]]
    learnings: Optional[List[str]]
    api_docs: Optional[Any]
    results_visualization: Optional[Any]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True, "alias_generator": to_camel, "populate_by_name": True}


class PublicationBase(BaseModel):
    slug: str
    title: str
    venue: Optional[str]
    publisher: Optional[str]
    type: Optional[str]
    year: Optional[int]
    domain: Optional[str]


class PublicationCreate(PublicationBase):
    pass


class PublicationOut(PublicationBase):
    id: int
    doi_url: Optional[str]
    paper_url: Optional[str]
    proof_url: Optional[str]
    event_photos: Optional[List[str]]
    certificate_url: Optional[str]
    authors: Optional[List[str]]
    problem: Optional[str]
    dataset: Optional[Any]
    contribution_summary: Optional[str]
    methodology: Optional[Any]
    key_results: Optional[Any]
    tldr: Optional[str]
    results_visualization: Optional[Any]
    deployment: Optional[Any]
    challenges: Optional[List[str]]
    insights: Optional[List[str]]
    model_config = {"from_attributes": True, "alias_generator": to_camel, "populate_by_name": True}


class BlogBase(BaseModel):
    slug: str
    title: str
    summary: Optional[str]
    content: Optional[str]
    author: Optional[str]
    category: Optional[str]
    tags: Optional[List[str]] = []


class BlogCreate(BlogBase):
    pass


class BlogOut(BlogBase):
    id: int
    published_date: Optional[datetime]
    model_config = {"from_attributes": True, "alias_generator": to_camel, "populate_by_name": True}


class CommentCreate(BaseModel):
    author: str
    author_email: Optional[EmailStr]
    content: str
    parent_id: Optional[int] = None


class CommentOut(BaseModel):
    id: int
    blog_id: int
    author: str
    author_email: Optional[EmailStr]
    content: str
    parent_id: Optional[int]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True, "alias_generator": to_camel, "populate_by_name": True}


class SkillCategoryCreate(BaseModel):
    name: str


class SkillCreate(BaseModel):
    category_id: Optional[int]
    name: str
    level: Optional[int]


class AchievementCreate(BaseModel):
    title: str
    organization: Optional[str]
    year: Optional[int]
    description: Optional[str]


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] 
    message: str


class ContactMessageOut(ContactMessageCreate):
    id: str
    status: Optional[str]
    created_at: Optional[datetime]
    model_config = {"from_attributes": True, "alias_generator": to_camel, "populate_by_name": True}
