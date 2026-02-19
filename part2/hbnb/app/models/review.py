from entity import Entity
from place import Place
from user import User


class Review(Entity, Place, User):
    def __init__(self, comment: str, rating: int, user: User, place: Place):

        super().__init__()
        self.comment = comment
        self.ratin = rating
        self.user = user
        self.place = place
