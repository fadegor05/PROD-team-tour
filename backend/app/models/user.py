from typing import List, TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from .meeting import Meeting


class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    phone: Mapped[str] = mapped_column(nullable=False, unique=True)
    fullname: Mapped[str] = mapped_column(nullable=False)
    organization: Mapped[str] = mapped_column(nullable=False)
    organization_type: Mapped[str] = mapped_column(nullable=False)

    meetings: Mapped[List['Meeting']] = relationship(back_populates='user', lazy='selectin')
