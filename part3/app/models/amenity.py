from sqlalchemy.orm import validates

from app import db
from app.models.baseclass import BaseModel


class Amenity(BaseModel):
    __tablename__ = "amenities"

    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=True, default="")

    @validates("name")
    def validate_name(self, _, value):
        if not isinstance(value, str):
            raise TypeError("name must be a string")
        value = value.strip()

        if not value:
            raise ValueError("name is required")

        if len(value) > 50:
            raise ValueError("name must be at most 50 characters")
        return value

    @validates("description")
    def validate_description(self, _, value):
        if value is None:
            return ""
        if not isinstance(value, str):
            raise TypeError("description must be a string")
        value = value.strip()

        if len(value) > 500:
            raise ValueError("description must be at most 500 characters")
        return value
