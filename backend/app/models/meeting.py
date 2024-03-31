from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from sqlalchemy import DateTime, ForeignKey
import datetime

if TYPE_CHECKING:
    from .user import User
    from .agent import Agent


class Meeting(Base):
    __tablename__ = 'meeting'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    agent_id: Mapped[int] = mapped_column(ForeignKey('agent.id'))
    status: Mapped[str] = mapped_column(nullable=False)
    start_datetime: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_datetime: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    place: Mapped[str] = mapped_column(nullable=False)
    lon: Mapped[float] = mapped_column(nullable=False)
    lat: Mapped[float] = mapped_column(nullable=False)

    user: Mapped['User'] = relationship(back_populates='meetings', lazy='selectin')
    agent: Mapped['Agent'] = relationship(back_populates='meetings', lazy='selectin')