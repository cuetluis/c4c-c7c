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
    unique_id = randint(1000000000, 9999999999)
    new_horse = Horse(id=unique_id)
    db.session.add(new_horse)
    db.session.commit()
    return jsonify(unique_id)