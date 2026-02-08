from . import db
from flask_login import UserMixin
from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.orm import declarative_base, relationship, Mapped, mapped_column
import datetime

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, default="")
    password = db.Column(db.String, default="")
    admin = db.Column(db.Boolean, default=False)
    editor = db.Column(db.Boolean, default=False)
    viewer = db.Column(db.Boolean, default=True)
    active = db.Column(db.Boolean, default=True)
    phone = db.Column(db.String, default="")
    updated_at = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)) 
    documents = db.relationship('Document')

@dataclass
class Horse(db.Model):
    __tablename__ = 'horses'
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String, default="Unknown Horse")
    biography: str = db.Column(db.String, default="")
    birth_year: int = db.Column(db.Integer)
    arrival_date: datetime = db.Column(db.DateTime)
    breed: str = db.Column(db.String, default="Unknown")
    gender: str = db.Column(db.String, default="Unknown")
    seen_by_vet: bool = db.Column(db.Boolean, default=False)
    seen_by_farrier: bool = db.Column(db.Boolean, default=False)
    service_horse: bool = db.Column(db.Boolean, default=False)
    ex_race_horse: bool = db.Column(db.Boolean, default=False)
    deceased: bool = db.Column(db.Boolean, default=False)
    death_date: datetime = db.Column(db.DateTime)
    grooming_day: str = db.Column(db.String, default="")
    pasture: str = db.Column(db.String, default="")
    behavior_notes: str = db.Column(db.Text, default="")
    regular_treatment: bool = db.Column(db.Boolean, default=False)
    medical_notes: str = db.Column(db.Text, default="")
    updated_at: datetime = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)) 
    user_id: int = db.Column(db.Integer, db.ForeignKey('users.id'))

    # medical
    left_eye: str = db.Column(db.String, default="Normal")
    right_eye: str = db.Column(db.String, default="Normal")
    heart_murmur: bool = db.Column(db.Boolean, default=False)
    cushings_positive: bool = db.Column(db.Boolean, default=False)
    heaves: bool = db.Column(db.Boolean, default=False)
    anhidrosis: bool = db.Column(db.Boolean, default=False)
    shivers: bool = db.Column(db.Boolean, default=False)

    # behavior
    bites: bool = db.Column(db.Boolean, default=False)
    kicks: bool = db.Column(db.Boolean, default=False)
    difficult_to_catch: bool = db.Column(db.Boolean, default=False)
    problem_with_needles: bool = db.Column(db.Boolean, default=False)
    problem_with_farrier: bool = db.Column(db.Boolean, default=False)
    sedation_for_farrier: bool = db.Column(db.Boolean, default=False)

    # feeding
    requires_extra_feed: bool = db.Column(db.Boolean, default=False)
    requires_mash: bool = db.Column(db.Boolean, default=False)

    # relationship
    treatments = db.relationship('Treatment')
    documents = db.relationship('Document')

class Treatment(db.Model):
    __tablename__ = 'treatment_types'
    id: int = db.Column(db.Integer, primary_key=True)
    frequency: str = db.Column(db.String, default="N/A")
    treatment_name: str = db.Column(db.String, default="")
    updated_at: datetime = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)) 
    horse_id: int = db.Column(db.Integer, db.ForeignKey('horses.id'))

class Document(db.Model):
    __tablename__ = 'horse_documents'
    id: int = db.Column(db.Integer, primary_key=True)
    image_url: str = db.Column(db.String, default="")
    description: str = db.Column(db.Text, default="")
    updated_at: datetime = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)) 
    user_id: int = db.Column(db.Integer, db.ForeignKey('users.id'))
    horse_id: int = db.Column(db.Integer, db.ForeignKey('horses.id'))

class TreatmentAction(db.Model):
    __tablename__ = 'treatment_actions'
    id: int = db.Column(db.Integer, primary_key=True)
    horse_id: int = db.Column(db.Integer, db.ForeignKey('horses.id'), nullable=False)
    treatment_type: str = db.Column(db.String, default="")
    action_taken: str = db.Column(db.String, default="")
    notes: str = db.Column(db.String, default="")
    updated_at: datetime = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)) 
    user_id: int = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class DailyObservation(db.Model):
    __tablename__ = 'observations'
    id: int = db.Column(db.Integer, primary_key=True)
    notes: str = db.Column(db.String, default="")
    to_do: bool = db.Column(db.Boolean, default=False)
    done: bool = db.Column(db.Boolean, default=False)
    notify: bool = db.Column(db.Boolean, default=False)
    updated_at: datetime = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))
    user_id: int = db.Column(db.Integer, db.ForeignKey('users.id'))

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id: int = db.Column(db.Integer, primary_key=True)
    updated_at: datetime = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))
    user_id: int = db.Column(db.Integer, db.ForeignKey('users.id'))
    table_changed: str = db.Column(db.String, default="")
    field_changed: str = db.Column(db.String, default="")
    before_value: str = db.Column(db.String, default="")
    after_value: str = db.Column(db.String, default="")