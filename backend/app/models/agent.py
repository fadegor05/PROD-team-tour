from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from .meeting import Meeting


class Agent(Base):
    __tablename__ = 'agent'

    id: Mapped[int] = mapped_column(primary_key=True)
    phone: Mapped[str] = mapped_column(nullable=False)
    fullname: Mapped[str] = mapped_column(nullable=False)

    meetings: Mapped[List['Meeting']] = relationship(back_populates='agent', lazy='selectin')