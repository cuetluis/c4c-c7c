from flask import Blueprint, jsonify
from flask_login import login_required
from . import db
from .models import Horse
from random import randint, randrange

views = Blueprint('views', __name__)

@views.route('/get-horse/<id>', methods=['POST', 'GET'])
def get_horse_data(id):
    horse = db.get_or_404(Horse, id)
    return jsonify(horse)

@views.route('/add-horse', methods=['POST', 'GET'])
def add_horse():
    # TODO: TAKE IN POST REQUESTS TO POPULATE FIELDS
    lower_bound = 1000000000
    upper_bound = 9999999999
    unique_id = randint(lower_bound, upper_bound)
    while (db.session.query(db.session.query(Horse).filter_by(id=unique_id).exists()).scalar()):
        unique_id = randint(lower_bound, upper_bound)
    new_horse = Horse(id=unique_id)
    db.session.add(new_horse)
    db.session.commit()
    return jsonify(unique_id)