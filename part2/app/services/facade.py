from app.models.amenity import Amenity
from app.models.user import User
from app.models.place import Place
from app.persistence.repository import InMemoryRepository


class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute("email", email)

    def get_all_user(self):
        return self.user_repo.get_all()

    def update_user(self, id, data):
        self.user_repo.update(id, data)
        return self.user_repo.get(id)

# ----- amenity -------------------------------

    def create_amenity(self, amenity_data):
        if not amenity_data.get("description"):
            amenity_data["description"] = ""
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, amenity_data):
        self.amenity_repo.update(amenity_id, amenity_data)
        return self.amenity_repo.get(amenity_id)

# ------ place ----------------------------------

    def create_place(self, place_data):
        amenities = place_data.pop('amenities')
        owner = self.user_repo.get(place_data.get('owner_id'))
        if owner is None:
            raise ValueError("owner id is not a valid id")

        place = Place(**place_data)

        for amenity in amenities:
            place.add_amenity(amenity)

        self.place_repo.add(place)
        return place

    def get_place(self, place_id):
        return self.place_repo.get(place_id)

    def get_all_places(self):
        return self.place_repo.get_all()

    def update_place(self, place_id, place_data):
        self.place_repo.update(place_id, place_data)
        return self.place_repo.get(place_id)
