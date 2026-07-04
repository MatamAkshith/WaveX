from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    Standard declarative Base class for SQLAlchemy models.
    All data models will inherit from this class.
    """
    pass
