import datetime
from typing import List, Optional
from dataclasses import dataclass

from sqlalchemy import Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_login import UserMixin

from . import db

# ==========================================
# CORE ENTITIES (User & Horse)
# ==========================================

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    # --- Identity & Auth ---
    id: Mapped[int] = mapped_column(Integer, primary_key=True, unique=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String, default="")
    phone: Mapped[str] = mapped_column(String, default="")

    # --- Permissions ---
    admin: Mapped[bool] = mapped_column(Boolean, default=False)
    editor: Mapped[bool] = mapped_column(Boolean, default=False)
    viewer: Mapped[bool] = mapped_column(Boolean, default=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    # --- Timestamps ---
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.datetime.now(datetime.timezone.utc), 
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    # --- Relationships ---
    documents: Mapped[List["Document"]] = relationship('Document', back_populates="user")
    actions: Mapped[List["TreatmentAction"]] = relationship('TreatmentAction', back_populates="user")
    observations: Mapped[List["DailyObservation"]] = relationship('DailyObservation', back_populates="user")
    audit_logs: Mapped[List["AuditLog"]] = relationship('AuditLog', back_populates="user")
    horses: Mapped[List["Horse"]] = relationship('Horse', back_populates="assigned_user")


class Horse(db.Model):
    __tablename__ = 'horses'

    # --- Identity & Bio ---
    id: Mapped[int] = mapped_column(Integer, primary_key=True, unique=True)
    name: Mapped[str] = mapped_column(String, default="Unknown Horse")
    biography: Mapped[str] = mapped_column(String, default="")
    breed: Mapped[str] = mapped_column(String, default="Unknown")
    gender: Mapped[str] = mapped_column(String, default="Unknown")
    birth_year: Mapped[Optional[int]] = mapped_column(Integer)
    
    # --- Status Flags ---
    deceased: Mapped[bool] = mapped_column(Boolean, default=False)
    death_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    active_service: Mapped[bool] = mapped_column(Boolean, default=False) # Renamed or mapped to existing if needed? Kept 'service_horse' below to match source.
    service_horse: Mapped[bool] = mapped_column(Boolean, default=False)
    ex_race_horse: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # --- Management ---
    arrival_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    grooming_day: Mapped[str] = mapped_column(String, default="")
    pasture: Mapped[str] = mapped_column(String, default="")
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('users.id'))

    # --- Medical Profile ---
    regular_treatment: Mapped[bool] = mapped_column(Boolean, default=False)
    seen_by_vet: Mapped[bool] = mapped_column(Boolean, default=False)
    seen_by_farrier: Mapped[bool] = mapped_column(Boolean, default=False)
    medical_notes: Mapped[str] = mapped_column(Text, default="")
    
    # Specific Conditions
    left_eye: Mapped[str] = mapped_column(String, default="Normal")
    right_eye: Mapped[str] = mapped_column(String, default="Normal")
    heart_murmur: Mapped[bool] = mapped_column(Boolean, default=False)
    cushings_positive: Mapped[bool] = mapped_column(Boolean, default=False)
    heaves: Mapped[bool] = mapped_column(Boolean, default=False)
    anhidrosis: Mapped[bool] = mapped_column(Boolean, default=False)
    shivers: Mapped[bool] = mapped_column(Boolean, default=False)

    # --- Behavior Profile ---
    behavior_notes: Mapped[str] = mapped_column(Text, default="")
    bites: Mapped[bool] = mapped_column(Boolean, default=False)
    kicks: Mapped[bool] = mapped_column(Boolean, default=False)
    difficult_to_catch: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Handling Sensitivities
    problem_with_needles: Mapped[bool] = mapped_column(Boolean, default=False)
    problem_with_farrier: Mapped[bool] = mapped_column(Boolean, default=False)
    sedation_for_farrier: Mapped[bool] = mapped_column(Boolean, default=False)

    # --- Feeding ---
    requires_extra_feed: Mapped[bool] = mapped_column(Boolean, default=False)
    requires_mash: Mapped[bool] = mapped_column(Boolean, default=False)

    # --- Timestamps ---
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.datetime.now(datetime.timezone.utc), 
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    # --- Relationships ---
    assigned_user: Mapped["User"] = relationship("User", back_populates="horses")
    treatments: Mapped[List["Treatment"]] = relationship('Treatment', back_populates="horse")
    documents: Mapped[List["Document"]] = relationship('Document', back_populates="horse")
    actions: Mapped[List["TreatmentAction"]] = relationship('TreatmentAction', back_populates="horse")

    def to_dict(self):
        return {
            # --- Basic Info ---
            "id": self.id,
            "name": self.name,
            "biography": self.biography,
            "arrival_date": self.arrival_date.isoformat() if self.arrival_date else None,
            
            # --- Status ---
            "deceased": self.deceased,
            "service_horse": self.service_horse,
            
            # --- Medical Summary ---
            "medical": {
                "notes": self.medical_notes,
                "regular_treatment": self.regular_treatment,
                "conditions": {
                     "cushings": self.cushings_positive,
                     "heaves": self.heaves
                }
            }
        }


# ==========================================
# OPERATIONAL LOGS & ACTIONS
# ==========================================

class TreatmentAction(db.Model):
    __tablename__ = 'treatment_actions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    horse_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('horses.id'))
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('users.id'))
    
    treatment_type: Mapped[str] = mapped_column(String, default="")
    action_taken: Mapped[str] = mapped_column(String, default="")
    notes: Mapped[str] = mapped_column(String, default="")
    
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.datetime.now(datetime.timezone.utc), 
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    # Relationships
    horse: Mapped["Horse"] = relationship("Horse", back_populates="actions")
    user: Mapped["User"] = relationship("User", back_populates="actions")

    def to_dict(self):
        return {
            "id": self.id,
            "treatment_type": self.treatment_type,
            "actions_taken": self.action_taken,
            "notes": self.notes,
            "created_at": self.updated_at.isoformat() if self.updated_at else None
        }


class DailyObservation(db.Model):
    __tablename__ = 'observations'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('users.id'))
    
    notes: Mapped[str] = mapped_column(String, default="")
    to_do: Mapped[bool] = mapped_column(Boolean, default=False)
    done: Mapped[bool] = mapped_column(Boolean, default=False)
    notify: Mapped[bool] = mapped_column(Boolean, default=False)
    
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.datetime.now(datetime.timezone.utc), 
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="observations")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "notes": self.notes,
            "to_do": self.to_do,
            "done": self.done,
            "notify": self.notify,
            "created_at": self.updated_at.isoformat() if self.updated_at else None
        }


# ==========================================
# SUPPORTING TABLES & ASSETS
# ==========================================

@dataclass
class Treatment(db.Model):
    __tablename__ = 'treatment_types'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    horse_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('horses.id'))
    
    treatment_name: Mapped[str] = mapped_column(String, default="")
    frequency: Mapped[str] = mapped_column(String, default="N/A")
    
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.datetime.now(datetime.timezone.utc), 
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    # Relationships
    horse: Mapped["Horse"] = relationship("Horse", back_populates="treatments")

    def to_dict(self):
        return {
            "id": self.id,
            "treatment_name": self.treatment_name,
            "frequency": self.frequency,
            # Do NOT return self.horse here
        }


@dataclass
class Document(db.Model):
    __tablename__ = 'horse_documents'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('users.id'))
    horse_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('horses.id'))
    
    image_url: Mapped[str] = mapped_column(String, default="")
    description: Mapped[str] = mapped_column(Text, default="")
    
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.datetime.now(datetime.timezone.utc), 
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="documents")
    horse: Mapped["Horse"] = relationship("Horse", back_populates="documents")

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "description": self.description,
            "created_at": self.updated_at.isoformat() if self.updated_at else None
        }


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('users.id'))
    
    table_changed: Mapped[str] = mapped_column(String, default="")
    field_changed: Mapped[str] = mapped_column(String, default="")
    before_value: Mapped[str] = mapped_column(String, default="")
    after_value: Mapped[str] = mapped_column(String, default="")
    
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.datetime.now(datetime.timezone.utc), 
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="audit_logs")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "table_changed": self.table_changed,
            "field_changed": self.field_changed,
            "before_value": self.before_value,
            "after_value": self.after_value,
            "timestamp": self.updated_at.isoformat() if self.updated_at else None
        }