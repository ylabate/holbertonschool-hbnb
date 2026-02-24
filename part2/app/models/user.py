from app.models.entity import Entity


class User(Entity):
    def __init__(self, first_name: str, last_name: str, email: str,
                 password: str = 'a', is_admin: bool = False):
        super().__init__()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.is_admin = is_admin
