from sqlalchemy import Column, DateTime, ForeignKeyConstraint, Index, Table, Text
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.orm import Mapped, declarative_base, mapped_column
from sqlalchemy.orm.base import Mapped

Base = declarative_base()
metadata = Base.metadata


class Users(Base):
    __tablename__ = 'users'

    id = mapped_column(INTEGER(11), primary_key=True)
    first_name = mapped_column(Text, nullable=False)
    last_name = mapped_column(Text, nullable=False)
    email = mapped_column(Text, nullable=False)
    phone_number = mapped_column(Text)


t_login_details = Table(
    'login_details', metadata,
    Column('id', INTEGER(11), nullable=False),
    Column('login', Text, nullable=False),
    Column('password', Text, nullable=False),
    ForeignKeyConstraint(['id'], ['users.id'], name='login_details_ibfk_1'),
    Index('id', 'id')
)


t_tokens = Table(
    'tokens', metadata,
    Column('id', INTEGER(11), nullable=False),
    Column('expiration_time', DateTime, nullable=False),
    Column('token', Text, nullable=False),
    ForeignKeyConstraint(['id'], ['users.id'], name='tokens_ibfk_1'),
    Index('id', 'id')
)
