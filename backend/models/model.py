#!/usr/bin/python3
"""model docstring"""
from datetime import datetime
import requests
from flask_login import UserMixin
from sqlalchemy.exc import IntegrityError
from sqlalchemy import Enum
from . import db


# Define the association table
show_genres = db.Table('show_genres',
    db.Column('show_id', db.Integer, db.ForeignKey('show.id')),
    db.Column('genre_id', db.Integer, db.ForeignKey('genre.id'))
)


# User Model
class User(db.Model, UserMixin):
    """"model docstring"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)


# Show Model
class Show(db.Model):
    """Model for a TV show"""
    __tablename__ = 'show'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)

    # TMDB data
    tmdb_id = db.Column(db.Integer, unique=True)  # For storing TMDB ID
    overview = db.Column(db.Text)
    poster_path = db.Column(db.String(255))  # Path to poster image
    backdrop_path = db.Column(db.String(255))  # Path to backdrop image
    original_language = db.Column(db.String(255))
    media_type = db.Column(db.String(255))
    vote_average = db.Column(db.Float)
    vote_count = db.Column(db.Integer)
    first_air_date = db.Column(db.Date)
    genres = db.relationship('Genre', secondary='show_genres', backref='shows')  # Many-to-Many for genres

    episodes = db.relationship('Episode', backref='show', lazy=True)

    def __init__(self, tmdb_data):
        self.title = tmdb_data['name']
        self.tmdb_id = tmdb_data['id']
        self.overview = tmdb_data['overview']
        self.poster_path = tmdb_data['poster_path']
        self.backdrop_path = tmdb_data['backdrop_path']
        self.original_language = tmdb_data['original_language']
        self.media_type = tmdb_data['media_type']
        self.vote_average = tmdb_data['vote_average']
        self.vote_count = tmdb_data['vote_count']
        self.first_air_date = datetime.strptime(tmdb_data['first_air_date'], '%Y-%m-%d').date()
        self.genres = self.get_or_create_genres(tmdb_data['genre_ids'])

    def get_or_create_genres(self, genre_ids):
        genres = []
        for genre_id in genre_ids:
            genre = Genre.query.filter_by(id=genre_id).first()
            if genre is None:
                genre_details = self.fetch_genre_details(genre_id)
                if genre_details:
                    genre = Genre(id=genre_id, name=genre_details['name'])
                    db.session.add(genre)
                    try:
                        db.session.commit()
                    except IntegrityError:
                        db.session.rollback()
                        # Handle the case where another process inserted the same genre concurrently
                        genre = Genre.query.filter_by(id=genre_id).first()
            if genre:
                genres.append(genre)
        return genres

    # Method to fetch genre details by ID
    def fetch_genre_details(self, genre_id):
        api_key = '02b8aead503b7db689db95a3fa599473'
        url = f"https://api.themoviedb.org/3/genre/{genre_id}?api_key={api_key}&language=en-US"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json()
        print(f"Error fetching genre details for ID: {genre_id}")
        return None

    def __repr__(self):
        """Returns a string representation of the Show object.

        Includes title, TMDB ID, and first air date (if available).

        Returns:
            str: A string representation of the Show object.
        """
        genre_names = ', '.join([genre.name for genre in self.genres])
        return f"<Show title: '{self.title}', TMDB ID: {self.tmdb_id}, first air date: {self.first_air_date}, genres: {genre_names}>"

# Genre Model
class Genre(db.Model):
    """Model for a genre"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<Genre {self.name}>"


# Episode Model
class Episode(db.Model):
    """"model docstring"""

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    season = db.Column(db.Integer, nullable=False)
    episode_number = db.Column(db.Integer, nullable=False)
    show_id = db.Column(db.Integer, db.ForeignKey('show.id'), nullable=False)

# whatchlist model
class Watchlist(db.Model):
    """"user  watchlist"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    show_id = db.Column(db.Integer, db.ForeignKey('show.tmdb_id'))
    status = db.Column(Enum('watching', 'completed', 'dropped', name='status_enum'), nullable=False, default='watching')



    def __init__(self, user_id, show_id, status='watching'):
        """Initialize a new Watchlist entry.

        Args:
        user_id (int): ID of the user for this watchlist entry.
        show_id (int): ID of the show to add to the watchlist.
        show status: watching', 'completed', 'dropped'.
        """
        self.user_id = user_id
        self.show_id = show_id
        self.status = status


    def __repr__(self):
        """Return a string representation of the Watchlist object.

        Returns:
        str: A string representation including user ID and show ID.
        """
        return f"<Watchlist user_id={self.user_id}, show_id={self.show_id}>"
