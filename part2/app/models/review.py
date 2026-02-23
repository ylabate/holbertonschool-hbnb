from app.models.entity import Entity
from app.models.place import Place
from app.models.user import User


class Review(Entity):
    def __init__(self, comment: str, rating: int, user: User, place: Place):

        super().__init__()
        self.comment = comment
        self.rating = rating
        self.user = user
        self.place = place
