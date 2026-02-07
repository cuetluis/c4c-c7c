import bson
import datetime
from dataclasses import dataclass, asdict

from flask import current_app, g
from werkzeug.local import LocalProxy
from flask_pymongo import PyMongo

from pymongo.errors import DuplicateKeyError, OperationFailure
from bson.objectid import ObjectId
from bson.errors import InvalidId


def get_db():
    """
    Configuration method to return db instance
    """
    db = getattr(g, "_database", None)

    if db is None:

        db = g._database = PyMongo(current_app).db
       
    return db

db = LocalProxy(get_db)

def add_user(name: str, admin: bool, editor: bool, viewer: bool, active: bool, phone: str, updated_at: datetime):
    user = {
            'name': name,
            'admin': admin,
            'editor': editor,
            'viewer': viewer,
            'active': active,
            'phone': phone,
            'updated_at': updated_at
           }
    return db.users.insert_one(user)

def add_treatment(treatment_type: str, frequency: str, updated_at: datetime, user_id: str):
    log = {
        'treatment_type': treatment_type,
        'frequency': frequency,
        'updated_at': updated_at,
        'user_id': user_id
    }
    return db.treatment_logs.insert_one(log)

@dataclass
class Medical():
    left_eye: str
    right_eye: str 
    image_url: str
    heart_murmur: bool
    cushings_positive: bool
    heaves: bool
    bites: bool
    kicks: bool
    anhidrosis: bool
    shivers: bool
        
@dataclass
class Behavior():
    bites: bool
    kicks: bool 
    difficult_to_catch: bool
    problem_with_needles: bool 
    problem_with_farrier: bool
    sedation_for_farrier: bool

@dataclass
class Feeding():
    requires_extra_feed: bool
    requires_mash: bool

@dataclass
class Horse():
    name: str
    biography: str
    birth_year: int
    arrival_date: datetime
    breed: str
    gender: str
    seen_by_vet: bool
    seen_by_farrier: bool
    service_horse: bool
    ex_race_horse: bool
    deceased: bool
    death_date: datetime
    grooming_day: str
    pasture: str
    medical_notes: str
    updated_at: datetime
    user_update: int
    medical_info: Medical


def add_horse(horse: Horse):
    entry = asdict(horse)
    return db.horses.insert_one(horse)

def add_service_record(seen_by_vet: bool, 
                      schedule_days: list, 
                      notes: str, 
                      observations: str, 
                      military_police_horse: bool):
    record = {
        'seen_by_vet': seen_by_vet,
        'schedule_days': schedule_days,
        'notes': notes,
        'observations': observations,
        'military_police_horse': military_police_horse
    }
    
    return db.service_records.insert_one(record)

def add_horse_document(horse_id: str, 
                       image_url: str,
                       description: str, 
                       last_updated: datetime, 
                       user_id: str):
    document = {
        'horse_id': horse_id,
        'image_url': image_url,
        'description': description,
        'last_updated': last_updated,
        'user_id': user_id
    }

    return db.horse_documents.insert_one(document)

def add_horse_document(horse_id: str, 
                       treatment: str,
                       description: str, 
                       last_updated: datetime, 
                       user_id: str):
    document = {
        'horse_id': horse_id,
        'treatment': treatment,
        'description': description,
        'last_updated': last_updated,
        'user_id': user_id
    }

    return db.actions_taken.insert_one(document)

def add_daily_observation(notes: str,
                          to_do: bool,
                          done: bool,
                          notify: bool,
                          updated_at: datetime,
                          user_id: str):
    
