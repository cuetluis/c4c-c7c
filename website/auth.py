from flask import Blueprint, render_template, jsonify, request, flash, redirect, url_for
from .models import User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from flask_cors import CORS

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    response = {'message': 'Please log in', 'category': 'info'}
    if request.method == 'POST':
        email = request.get_json().get('email')
        password = request.get_json().get('password')
        user = User.query.filter_by(email=email).first()

        if user:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                response = {'message': 'Logged in successfully!', 'category': 'success'}
            else:
                response = {'message': 'Incorrect password! Try again.', 'category': 'error'}
        else:
            response = {'message': 'Email does not exist.', 'category': 'error'}

    return jsonify(response)

@auth.route('/logout')
#@login_required
def logout():
    logout_user()
    return redirect(url_for('auth_login'))

@auth.route('/signup', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        user = User.query.filter_by(email=email).first()

        if user:
            response = {'message': 'Email already exists.', 'category': 'error'}
        elif len(email) < 4:
            response = {'message': 'Email must be greater than four characters.', 'category': 'error'}
        elif len(name) < 1:
            response = {'message': 'First name must be more than one character.', 'category': 'error'}
        elif len(password1) < 8:
            response = {'message': 'Password must be at least 8 characters.', 'category': 'error'}
        elif password1 != password2:
            response = {'message': 'Passwords don\'t match.', 'category': 'error'}
        else:
            new_user = User(email=email, name=name, password = generate_password_hash(password1, method='scrypt'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            response = {'message': 'Accounted created!', 'category': 'success'}
        
    return jsonify(response)