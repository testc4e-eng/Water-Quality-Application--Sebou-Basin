# backend/app/models/wasp.py
from sqlalchemy import String, Integer, Text, Date, ForeignKey, Double, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date
from app.db.base import Base

class WaspScenario(Base):
    __tablename__ = "wasp_scenarios"
    __table_args__ = {"schema": "wasp_sebou"}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    model_version: Mapped[str | None] = mapped_column(String(50))
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)

class WaspVariable(Base):
    __tablename__ = "wasp_variables"
    __table_args__ = {"schema": "wasp_sebou"}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    unit: Mapped[str | None] = mapped_column(String(20))

class WaspResult(Base):
    __tablename__ = "wasp_results"
    __table_args__ = {"schema": "wasp_sebou"}

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    scenario_id: Mapped[int] = mapped_column(Integer, ForeignKey("wasp_sebou.wasp_scenarios.id", ondelete="CASCADE"), nullable=False)
    variable_id: Mapped[int] = mapped_column(Integer, ForeignKey("wasp_sebou.wasp_variables.id"), nullable=False)
    segment_id: Mapped[int] = mapped_column(Integer, nullable=False) # Maps to spatial segments
    date: Mapped[date] = mapped_column(Date, nullable=False)
    value: Mapped[float] = mapped_column(Double, nullable=False)

    scenario = relationship("WaspScenario")
    variable = relationship("WaspVariable")
