import bson
import datetime

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

class Medical():
    def __init__(self,
                 left_eye: str, 
                 right_eye: str, 
                 image_url: str,
                 heart_murmur: bool, 
                 cushings_positive: bool, 
                 heaves: bool, 
                 bites: bool, 
                 kicks: bool, 
                 anhidrosis: bool,
                 shivers: bool):
        self.left_eye = left_eye
        self.right_eye = right_eye
        self.heart_murmur = heart_murmur
        self.cushings_positive = cushings_positive
        self.heaves = heaves
        self.anhidrosis = anhidrosis,
        self.shivers = shivers

class Behavior():
    def __init__(self,
                 bites: bool, 
                 kicks: bool, 
                 difficult_to_catch: bool,
                 problem_with_needles: bool, 
                 problem_with_farrier: bool,
                 sedation_for_farrier: bool):
        self.bites = bites
        self.kicks = kicks, 
        self.difficult_to_catch = difficult_to_catch,
        self.problem_with_needles = problem_with_needles, 
        self.problem_with_farrier = problem_with_farrier,
        self.sedation_for_farrier = sedation_for_farrier):



def add_horse(name: str, 
              biography: str, 
              birth_year: int, 
              arrival_date: datetime, 
              breed: str, gender: str, 
              difficult_to_catch: bool, 
              problem_with_needles: bool, 
              problem_with_farrier: bool, 
              requires_extra_feed: bool, 
              requires_extra_mash: bool, 
              sedation_for_farrier: bool):
    horse = {
        'name': name,
        'biography': biography,
        'birth_year': birth_year,
        'arrival_date': arrival_date,
        'breed': breed,
        'gender': gender,
        'left_eye': left_eye,
        'right_eye': right_eye,
        'image_url': image_url,
        'heart_murmur': heart_murmur,
        'cushings_positive': cushings_positive,
        'heaves': heaves,
        'bites': bites,
        'kicks': kicks,
        'difficult_to_catch': difficult_to_catch,
        'problem_with_needles': problem_with_needles,
        'problem_with_farrier': problem_with_farrier,
        'requires_extra_feed': requires_extra_feed,
        'requires_extra_mash': requires_extra_mash,
        'sedation_for_farrier': sedation_for_farrier
    }
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