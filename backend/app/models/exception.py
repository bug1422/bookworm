class NotFoundException(Exception):
    def __init__(self, entity):
        super().__init__(f"{entity} not found")