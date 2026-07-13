from __future__ import annotations

import uuid
from typing import List, Optional

from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    DateTime,
    ForeignKey,
    func,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship, declarative_base, backref
from sqlalchemy import create_engine

Base = declarative_base()


class Profile(Base):
    __tablename__ = "profile"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    tagline = Column(Text)
    headline = Column(Text)
    impact_statement = Column(Text)
    bio = Column(Text)
    profile_image = Column(Text)
    resume_url = Column(Text)
    email = Column(Text)
    phone = Column(Text)
    location = Column(Text)
    social_links = Column(JSONB)
    contact_cta = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = (
        Index("idx_projects_tech_stack", "tech_stack", postgresql_using="gin"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(Text, unique=True, nullable=False, index=True)
    title = Column(Text, nullable=False)
    summary = Column(Text)
    tech_stack = Column(ARRAY(Text))
    github_url = Column(Text)
    live_demo_url = Column(Text)
    image_url = Column(Text)
    problem_statement = Column(Text)
    dataset = Column(JSONB)
    model = Column(JSONB)
    system_architecture = Column(Text)
    metrics = Column(JSONB)
    deployment = Column(JSONB)
    optimization = Column(ARRAY(Text))
    challenges = Column(ARRAY(Text))
    learnings = Column(ARRAY(Text))
    api_docs = Column(JSONB)
    results_visualization = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Publication(Base):
    __tablename__ = "publications"
    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(Text, unique=True, nullable=False, index=True)
    title = Column(Text, nullable=False)
    venue = Column(Text)
    publisher = Column(Text)
    type = Column(Text)
    year = Column(Integer)
    contribution_summary = Column(Text)
    key_results = Column(ARRAY(Text))
    domain = Column(Text)
    doi_url = Column(Text)
    paper_url = Column(Text)
    proof_url = Column(Text)
    event_photos = Column(JSONB)
    certificate_url = Column(Text)
    authors = Column(ARRAY(Text))
    tldr = Column(Text)
    problem = Column(Text)
    dataset = Column(JSONB)
    methodology = Column(Text)
    architecture = Column(Text)
    experiments = Column(JSONB)
    performance_analysis = Column(Text)
    results_visualization = Column(JSONB)
    deployment = Column(Text)
    challenges = Column(ARRAY(Text))
    insights = Column(ARRAY(Text))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(Text, unique=True, nullable=False, index=True)
    title = Column(Text, nullable=False)
    summary = Column(Text)
    content = Column(Text)
    author = Column(Text)
    author_image = Column(Text)
    published_date = Column(DateTime(timezone=True))
    updated_date = Column(DateTime(timezone=True))
    category = Column(Text)
    tags = Column(ARRAY(Text))
    read_time = Column(Text)
    image_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class BlogComment(Base):
    __tablename__ = "blog_comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    blog_id = Column(Integer, ForeignKey("blogs.id", ondelete="CASCADE"), nullable=False, index=True)
    author = Column(Text, nullable=False)
    author_email = Column(Text)
    content = Column(Text, nullable=False)
    parent_id = Column(Integer, ForeignKey("blog_comments.id", ondelete="CASCADE"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # relationships
    replies = relationship("BlogComment", backref=backref("parent", remote_side=[id]), cascade="all, delete")
    blog = relationship("Blog", backref=backref("comments", cascade="all, delete-orphan"))


class SkillCategory(Base):
    __tablename__ = "skill_categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text, nullable=False, unique=True)
    skills = relationship("Skill", back_populates="category", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("skill_categories.id", ondelete="SET NULL"))
    name = Column(Text, nullable=False)
    level = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    category = relationship("SkillCategory", back_populates="skills")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text, nullable=False)
    organization = Column(Text)
    year = Column(Integer)
    description = Column(Text)
    category = Column(Text)
    certificate_url = Column(Text)
    event_image_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ContactComment(Base):
    __tablename__ = "contact_comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    author = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    avatar = Column(Text)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False, index=True)
    subject = Column(Text, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(Text, default="new")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class APIRequestLog(Base):
    __tablename__ = "api_request_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    method = Column(Text)
    path = Column(Text, index=True)
    status = Column(Integer)
    ip = Column(Text)
    user_agent = Column(Text)
    request_body = Column(JSONB)
    response_body = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


def init_db(database_url: Optional[str] = None) -> None:
    """Helper to create tables. Provide a `database_url` or set DATABASE_URL env var."""
    url = database_url or "postgresql://postgres:password@localhost:5432/portfolio_db"
    engine = create_engine(url, echo=False)
    Base.metadata.create_all(engine)


__all__ = [
    "Base",
    "Profile",
    "Project",
    "Publication",
    "Blog",
    "BlogComment",
    "SkillCategory",
    "Skill",
    "Achievement",
    "ContactComment",
    "ContactMessage",
    "APIRequestLog",
    "init_db",
]
