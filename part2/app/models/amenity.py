from app.models.entity import Entity


class Amenity(Entity):
    def __init__(self, name: str, description: str = None):
        super().__init__()
        self.name = name
        self.description = description

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value: str):

        if not isinstance(value, str):
            raise TypeError("name must be a string")
        value = value.strip()

        if not value:
            raise ValueError("name is required")

        if len(value) > 50:
            raise ValueError("name must be at most 50 characters")
        self._name = value
