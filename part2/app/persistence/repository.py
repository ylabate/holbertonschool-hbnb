from abc import ABC, abstractmethod


class Repository(ABC):
    @abstractmethod
    def add(self, obj) -> None:
        pass

    @abstractmethod
    def get(self, obj_id) -> object | None:
        pass

    @abstractmethod
    def get_all(self) -> list[object]:
        pass

    @abstractmethod
    def update(self, obj_id, data) -> None:
        pass

    @abstractmethod
    def delete(self, obj_id) -> None:
        pass

    @abstractmethod
    def get_by_attribute(self, attr_name, attr_value) -> object | None:
        pass


class InMemoryRepository(Repository):
    def __init__(self):
        self._storage = {}

    def add(self, obj) -> None:
        self._storage[obj.id] = obj

    def get(self, obj_id) -> object | None:
        return self._storage.get(obj_id)

    def get_all(self) -> list[object]:
        return list(self._storage.values())

    def update(self, obj_id, data) -> None:
        obj = self.get(obj_id)
        if obj:
            obj.update(data)

    def delete(self, obj_id) -> None:
        if obj_id in self._storage:
            del self._storage[obj_id]

    def get_by_attribute(self, attr_name, attr_value) -> object | None:
        return next(
            (
                obj
                for obj in self._storage.values()
                if getattr(obj, attr_name) == attr_value
            ),
            None,
        )
