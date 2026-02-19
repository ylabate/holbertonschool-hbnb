from entity import Entity


class Amenity(Entity):
    def __init__(self, name: str, description: str):
        super().__init__()
        self.name = name
        self.description = description
