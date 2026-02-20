# backend/app/models/swat.py
from sqlalchemy import String, Integer, Text, Date, ForeignKey, CheckConstraint, BigInteger, Double
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date
from app.db.base import Base

class SwatModel(Base):
    __tablename__ = "swat_models"
    __table_args__ = {"schema": "swat_sebou"}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    version: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)

class SwatScenario(Base):
    __tablename__ = "swat_scenarios"
    __table_args__ = {"schema": "swat_sebou"}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    model_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("swat_sebou.swat_models.id", ondelete="SET NULL"))
    name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    timestep: Mapped[str | None] = mapped_column(String(16))

class SwatSubbasinResult(Base):
    __tablename__ = "swat_subbasin_results"
    __table_args__ = {"schema": "swat_sebou"}

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    scenario_id: Mapped[int] = mapped_column(Integer, ForeignKey("swat_sebou.swat_scenarios.id", ondelete="CASCADE"), nullable=False)
    subbasin: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)

    precip: Mapped[float | None] = mapped_column(Double)
    surq:   Mapped[float | None] = mapped_column(Double)
    gw_q:   Mapped[float | None] = mapped_column(Double)
    wyld:   Mapped[float | None] = mapped_column(Double)
    sedp:   Mapped[float | None] = mapped_column(Double)
    orgn:   Mapped[float | None] = mapped_column(Double)
    solp:   Mapped[float | None] = mapped_column(Double)

class SwatReachResult(Base):
    __tablename__ = "swat_reach_results"
    __table_args__ = {"schema": "swat_sebou"}

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    scenario_id: Mapped[int] = mapped_column(Integer, ForeignKey("swat_sebou.swat_scenarios.id", ondelete="CASCADE"), nullable=False)
    reach: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)

    flow_in:  Mapped[float | None] = mapped_column(Double)
    flow_out: Mapped[float | None] = mapped_column(Double)
    sed_in:   Mapped[float | None] = mapped_column(Double)
    sed_out:  Mapped[float | None] = mapped_column(Double)
    no3_out:  Mapped[float | None] = mapped_column(Double)
    orgp_out: Mapped[float | None] = mapped_column(Double)
    chla_out: Mapped[float | None] = mapped_column(Double)
