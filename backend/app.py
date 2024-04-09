#!/usr/bin/python3
"""doc string"""
from flask import Flask, url_for, render_template, redirect, flash, jsonify, request
from flask_cors import CORS

from flask_login import LoginManager, login_required, logout_user, login_user, current_user
from flask_wtf import FlaskForm
from flask_wtf.csrf import generate_csrf, CSRFProtect
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError, Email

from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

########################################
# for migration work with this import  #
########################################
# from .models.model import Watchlist
# from .models.model import User
# from .models.model import Show
# from .models import db
########################################
# starting flask work with this import #
########################################
from models.model import Watchlist
from models.model import User
from models.model import Show
from models import db
###################



# Instantiate Flask app
app = Flask(__name__)
CORS(app, origins=['http://172.23.220.216:3000'], supports_credentials=True)
# Configure the SQLAlchemy database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://abdo160:Zrodo*159@localhost/whatch_track_db'
app.config['SECRET_KEY'] = 'thisisasecretkey'

db.init_app(app)
bcrypt = Bcrypt(app)
# migrate the table to the database
migrate = Migrate(app, db)
# handle login user
login_manager = LoginManager()
login_manager.init_app(app)

csrf = CSRFProtect(app)

@login_manager.user_loader
def load_user(user_id):
    """ doc string """
    with db.session() as session:  # Create a session
        return session.get(User, int(user_id))  # Use Session.get() with arguments

class RegisterForm(FlaskForm):
    """ form for register """
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)],
                           render_kw={"placeholder": "Username"})

    email = StringField(validators=[
                           InputRequired(), Email(), Length(min=4, max=120)],
                           render_kw={"placeholder": "Email"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)],
                             render_kw={"placeholder": "Password"})

    submit = SubmitField('Register')

    def validate_username(self, username):
        """doc string"""
        existing_user_username = User.query.filter_by(
            username=username.data).first()
        if existing_user_username:
            raise ValidationError(
                'That username already exists. Please choose a different one.')

    def validate_email(self, email):
        """use email once"""
        existing_user_email = User.query.filter_by(
            email=email.data).first()
        if existing_user_email:
            raise ValidationError(
                'That email address is already registered. Please use a different one.')

class LoginForm(FlaskForm):
    """ form for login """
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)],
                           render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)],
                             render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')


# route for home page
@app.route('/', strict_slashes=False)
def index():
    """returns index page!"""
    return render_template('index.html')




# route for register
@app.route('/register', methods=['GET', 'POST'], strict_slashes=False)
def register():
    """returns register page!"""
    form = RegisterForm()


    if form.validate_on_submit():
        # Form data is valid, proceed with registration
        username = form.username.data
        email = form.email.data
        password = form.password.data
        # hash the password
        hashed_password = bcrypt.generate_password_hash(password)
        # Create a new user in the database
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('login'))

    return render_template('register.html', form=form)


# route for login page
@app.route('/login', methods=['GET', 'POST'], strict_slashes=False)
def login():
    """returns login page!"""
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        user = User.query.filter_by(username=username).first()
        if user:
            if bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for('dashboard'))
            flash('Invalid username or password.', 'error')
        else:
            flash('User not found.', 'error')
        return redirect(url_for('login'))
    return render_template('login.html', form=form)

@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    """route to dashboard"""
    return render_template('dashboard.html')


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    """exit dashboard"""
    logout_user()
    return redirect(url_for('login'))


@app.route('/add-show', methods=['POST'])
@login_required
def add_show():
    """ add new show """
    # Get the show data from the request body
    show_data = request.get_json()

    # Validate data (optional)
    # You can add checks for required fields or data format

    # Create a Show object from the TMDB data
    new_show = Show(show_data)

    # Add the show to the database session
    db.session.add(new_show)

    # Commit the changes to the database
    try:
        db.session.commit()
        return jsonify({'message': 'Show added successfully'}), 201
    except Exception as e:
        # Handle potential database errors
        print(f"Error adding show: {e}")
        db.session.rollback()
        return jsonify({'message': 'Failed to add show'}), 500


@app.route('/api/watchlist/add/<int:show_id>', methods=['POST'])
@login_required
def add_to_watchlist(show_id):
    """ add a show to the watchlist """
    # Get current user
    user = current_user
    print(user)
    # Check if show already exists in watchlist
    existing_entry = Watchlist.query.filter_by(user_id=user.id, show_id=show_id).first()

    if existing_entry:
        return jsonify({'message': 'Show already exists in watchlist'})

    # Access TMDB data from the request body (assuming it's sent as JSON)
    try:
        request_data = request.get_json()
        tmdb_data = request_data['tmdb_data']
        print(tmdb_data)
    except (KeyError, TypeError):
        return jsonify({'message': 'Invalid request format: missing or invalid tmdb_data'}), 400

    # Create a new show entry or use existing one
    # existing_show = Show.query.filter_by(tmdb_id=tmdb_data['id']).first()
    # print('---------')
    # print(existing_show)
    # if existing_show:
    #     return jsonify({'message': 'Show already exists in show'})

    show = Show.query.filter_by(tmdb_id=show_id).first()
    if not show:
        print('000000000')
        new_show = Show(tmdb_data)
        db.session.add(new_show)
        db.session.commit()
    else:
        new_show = show
    print(new_show)
    print('++++++++++++')
    # Add entry to watchlist
    watchlist_entry = Watchlist(user_id=user.id, show_id=show_id)
    print('---------')
    print(watchlist_entry)



    db.session.add(watchlist_entry)  # Add the watchlist entry to the session
    print('***********')
    print('++++++++++++')
    db.session.commit()
    return jsonify({'message': 'Show added to watchlist'}), 201


@app.route('/api/watchlist', methods=['GET'])
@login_required
def get_watchlist():
    """ Fetches the watchlist for the currently logged-in user """
    user = current_user
    print(user)
    # Query watchlist entries for the user
    watchlist_entries = Watchlist.query.filter_by(user_id=user.id).all()
    print(watchlist_entries)
    # Prepare watchlist data (consider what data you need to send to React)
    watchlist_data = []
    for entry in watchlist_entries:
        show = Show.query.filter_by(tmdb_id=entry.show_id).first()
        print(show)
        if show:  # Check if show exists (optional)
            watchlist_data.append({
                'id': entry.id,  # Watchlist entry ID (optional)
                'show_id': show.tmdb_id,
                'name': show.title,
                'poster_path': show.poster_path,  # Include poster path if needed
                'original_language': show.original_language,
                'media_type' : show.media_type,
                'overview' : show.overview,
                'popularity' : show.vote_average,
                'vote_count' : show.vote_count,
                'first_air_date':show.first_air_date,
                'status' : entry.status,

                # Add other relevant show data as needed
            })

    return jsonify({'watchlist': watchlist_data})




@app.route('/get_csrf_token', methods=['GET'])
def get_csrf_token():
    """ DOCS TRING """
    token = generate_csrf()
    return jsonify({'csrf_token': token})

@app.route('/is_logged_in', methods=['GET'])
@login_required  # Ensure this decorator is applied
def check_login_status():
    """check the status of user"""
    return jsonify({'is_logged_in': True})  # or false if not logged in

@app.route('/api/watchlist/delete/<int:show_id>', methods=['DELETE'])
@login_required
def delete_from_watchlist(show_id):
    """ Delete a show from the watchlist """
    user = current_user
    # Query the watchlist entry to delete
    watchlist_entry = Watchlist.query.filter_by(user_id=user.id, show_id=show_id).first()

    if watchlist_entry:
        try:
            db.session.delete(watchlist_entry)  # Delete the watchlist entry
            db.session.commit()
            return jsonify({'message': 'Show deleted from watchlist'}), 200
        except Exception as e:
            # Handle database errors
            print(f"Error deleting show from watchlist: {e}")
            db.session.rollback()
            return jsonify({'message': 'Failed to delete show from watchlist'}), 500
    else:
        return jsonify({'message': 'Show not found in watchlist'}), 404


@app.route('/api/watchlist/update-status/<int:watchlist_entry_id>', methods=['PATCH'])
@login_required
def update_watchlist_status(watchlist_entry_id):
    """ update the status of a show in the whatch list """
    user = current_user

    # Get the requested watchlist entry
    watchlist_entry = Watchlist.query.get(watchlist_entry_id)
    if not watchlist_entry or watchlist_entry.user_id != user.id:
        return jsonify({'message': 'Watchlist entry not found or unauthorized'}), 404

    try:
        request_data = request.get_json()
        new_status = request_data.get('status')

        if new_status not in ('watching', 'completed', 'dropped'):
            return jsonify({'message': 'Invalid status value'}), 400

        # Update the status of the watchlist entry
        watchlist_entry.status = new_status
        db.session.commit()

        return jsonify({'message': 'Status updated successfully'}), 200

    except Exception as e:
        print(f"Error updating status of watchlist entry: {e}")
        db.session.rollback()
        return jsonify({'message': 'Failed to update status'}), 500



if __name__ == "__main__":
    app.run('0.0.0.0', debug=True)
