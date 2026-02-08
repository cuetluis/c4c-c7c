from flask import Blueprint, render_template, flash, request, redirect, url_for
from flask_login import login_required, current_user
from . import Note
from .. import db
from .models import Horse
from random import randint, randrange
import json
import jsonify

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        note = request.form.get('note')
        if len(note) < 1:
            flash('Message is too short.', category='error')
        else:
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category='success')
            return redirect(url_for('views.home'))

    return render_template('home.html', user=current_user)

@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
    
    return jsonify({})

@views.route('/get-horse/<horse_id>', methods=['POST'])
@login_required
def get_horse_data(horse_id):
    horse = Horse.query.get(horse_id)
    return jsonify(horse)

@views.route('/add-horse', methods=['GET', 'POST'])
@login_required
def add_horse():
    unique_id = randint(1000000000, 9999999999)
    new_horse = Horse(id=unique_id)
    db.session.add(new_horse)
    db.session.commit()