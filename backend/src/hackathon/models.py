from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

class Calculation(Base):
    __tablename__ = "calculations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    calculation_timestamp = Column(String, nullable=False)
    expected_pension = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    sex = Column(String, nullable=False)
    salary = Column(String, nullable=False)
    is_sick_leave_included = Column(Boolean, nullable=False)
    total_accumulated_funds = Column(String, nullable=False)
    year_work_start = Column(Integer, nullable=False)
    year_desired_retirement = Column(Integer, nullable=False)
    postal_code = Column(String, nullable=True)

    jobs = relationship("Job", back_populates="calculation", cascade="all, delete-orphan")
    leaves = relationship("Leave", back_populates="calculation", cascade="all, delete-orphan")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True)
    calculation_id = Column(String, ForeignKey("calculations.id"), nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=True)
    base_salary = Column(Integer, nullable=False)
    calculation = relationship("Calculation", back_populates="jobs")

class Leave(Base):
    __tablename__ = "leaves"
    id = Column(Integer, primary_key=True)
    calculation_id = Column(String, ForeignKey("calculations.id"), nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=True)
    calculation = relationship("Calculation", back_populates="leaves")
