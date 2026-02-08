from flask import Blueprint, render_template, jsonify, request, flash, redirect, url_for
from .models import User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from flask_cors import CORS

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
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
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth_login'))

@auth.route('/signup', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        firstName = request.form.get('firstName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        user = User.query.filter_by(email=email).first()

        if user:
            flash('Email already exists.', category='error')
        elif len(email) < 4:
            flash('Email must be greater than four characters.', category='error')
        elif len(firstName) < 1:
            flash('First name must be more than one character.', category='error')
        elif len(password1) < 8:
            flash('Password must be at least 8 characters.', category='error')
        elif password1 != password2:
            flash("Passwords don't match.", category='error')
        else:
            new_user = User(email=email, firstName=firstName, password = generate_password_hash(password1, method='scrypt'))
            db.session.add(new_user)
            db.session.commit()
            flash('Account created!', category='success')
            login_user(current_user, remember=True)
            return redirect(url_for('views.home'))
        
    return render_template('signup.html', user=current_user)