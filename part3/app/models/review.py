from sqlalchemy.orm import validates

from app import db
from app.models.baseclass import BaseModel


class Review(BaseModel):
    __tablename__ = "reviews"

    text = db.Column(db.String(500), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.String(36), nullable=False)
    place_id = db.Column(db.String(36), nullable=False)

    @property
    def user(self):
        return self.__dict__.get("_user")

    @user.setter
    def user(self, value):
        self.__dict__["_user"] = value

    @property
    def place(self):
        return self.__dict__.get("_place")

    @place.setter
    def place(self, value):
        self.__dict__["_place"] = value

    @validates("text")
    def validate_text(self, _, value):
        if not isinstance(value, str):
            raise TypeError("text must be a string")
        value = value.strip()

        if not value:
            raise ValueError("text is required")
        return value

    @property
    def comment(self):
        return self.text

    @comment.setter
    def comment(self, value: str):
        self.text = value

    @validates("rating")
    def validate_rating(self, _, value):
        if not isinstance(value, int):
            raise TypeError("rating must be an integer")

        if value < 1 or value > 5:
            raise ValueError("rating must be between 1 and 5")
        return value
