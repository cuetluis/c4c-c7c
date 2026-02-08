from . import db
from flask_login import UserMixin
from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, Mapped, mapped_column
import datetime

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    admin = db.Column(db.Boolean)
    editor = db.Column(db.Boolean)
    viewer = db.Column(db.Boolean)
    active = db.Column(db.Boolean)
    phone = db.Column(db.String)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.now(tz=datetime.UTC)) 

    documents = db.relationship('Document')

@dataclass
class Horse(db.Model):
    __tablename__ = 'horses'

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String)
    biography: str = db.Column(db.String)
    birth_year: int = db.Column(db.Integer)
    arrival_date: datetime = db.Column(db.DateTime)
    breed: str = db.Column(db.String)
    gender: str = db.Column(db.String)
    seen_by_vet: bool = db.Column(db.Boolean)
    seen_by_farrier: bool = db.Column(db.Boolean)
    service_horse: bool = db.Column(db.Boolean)
    ex_race_horse: bool = db.Column(db.Boolean)
    deceased: bool = db.Column(db.Boolean)
    death_date: datetime = db.Column(db.DateTime)
    grooming_day: str = db.Column(db.String)
    pasture: str = db.Column(db.String)
    behavior_notes: str = db.Column(db.Text)
    regular_treatment: bool = db.Column(db.Boolean)
    medical_notes: str = db.Column(db.Text)
    updated_at: datetime = db.Column(db.DateTime, default=datetime.datetime.now(tz=datetime.UTC)) 

    user_id: int = db.Column(db.Integer, db.ForeignKey('users.id'))

    # medical
    left_eye: str = db.Column(db.String)
    right_eye: str = db.Column(db.String)
    heart_murmur: bool = db.Column(db.Boolean)
    cushings_positive: bool = db.Column(db.Boolean)
    heaves: bool = db.Column(db.Boolean)
    anhidrosis: bool = db.Column(db.Boolean)
    shivers: bool = db.Column(db.Boolean)

    # behavior
    bites: bool = db.Column(db.Boolean)
    kicks: bool = db.Column(db.Boolean)
    difficult_to_catch: bool = db.Column(db.Boolean)
    problem_with_needles: bool = db.Column(db.Boolean)
    problem_with_farrier: bool = db.Column(db.Boolean)
    sedation_for_farrier: bool = db.Column(db.Boolean)

    # feeding
    requires_extra_feed: bool = db.Column(db.Boolean)
    requires_mash: bool = db.Column(db.Boolean)

    # relationship
    treatments = db.relationship('Treatment')
    documents = db.relationship('Document')

class Treatment(db.Model):
    __tablename__ = 'treatment_types'
    id = db.Column(db.Integer, primary_key=True)
    frequency = db.Column(db.String, default="N/A")
    treatment_name = db.Column(db.String)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.now(tz=datetime.UTC)) 

    horse_id = db.Column(db.Integer, db.ForeignKey('horses.id'))

class Document(db.Model):
    __tablename__ = 'horse_documents'

    id = db.Column(db.Integer, primary_key=True)

    image_url = db.Column(db.String)
    description = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.now(tz=datetime.UTC)) 

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    horse_id = db.Column(db.Integer, db.ForeignKey('horses.id'))

class TreatmentAction(db.Model):
    __tablename__ = 'treatment_actions'

    id = db.Column(db.Integer, primary_key=True)
    horse_id = db.Column(db.Integer, db.ForeignKey('horses.id'), nullable=False)
    treatment_type = db.Column(db.String)
    action_taken = db.Column(db.String)
    notes = db.Column(db.String)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.now(tz=datetime.UTC)) 

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class DailyObservation(db.Model):
    __tablename__ = 'observations'
    id = db.Column(db.Integer, primary_key=True)
    notes = db.Column(db.String)
    to_do = db.Column(db.Boolean)
    done = db.Column(db.Boolean)
    notify = db.Column(db.Boolean)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.now(tz=datetime.UTC))

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = db.Column(db.Integer, primary_key=True)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.now(tz=datetime.UTC))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    table_changed = db.Column(db.String)
    field_changed = db.Column(db.String)
    before_value = db.Column(db.String)
    after_value = db.Column(db.String)