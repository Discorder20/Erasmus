from typing import List

from sqlalchemy import Column, DECIMAL, Date, DateTime, ForeignKeyConstraint, Index, String, Table, Text, text
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship
from sqlalchemy.orm.base import Mapped

Base = declarative_base()
metadata = Base.metadata


class Cities(Base):
    __tablename__ = 'cities'

    id = mapped_column(INTEGER(11), primary_key=True)
    name = mapped_column(String(255), nullable=False)
    coord_x = mapped_column(DECIMAL(10, 6), nullable=False)
    coord_y = mapped_column(DECIMAL(10, 6), nullable=False)


class Tags(Base):
    __tablename__ = 'tags'

    id = mapped_column(INTEGER(11), primary_key=True)
    name = mapped_column(String(255), nullable=False)

    game: Mapped['Games'] = relationship('Games', secondary='game_tags', back_populates='tag')


class Users(Base):
    __tablename__ = 'users'

    id = mapped_column(INTEGER(11), primary_key=True)
    first_name = mapped_column(String(255), nullable=False)
    last_name = mapped_column(String(255), nullable=False)
    email = mapped_column(String(255), nullable=False)
    phone_number = mapped_column(String(255))

    games: Mapped[List['Games']] = relationship('Games', uselist=True, back_populates='author')


class Games(Base):
    __tablename__ = 'games'
    __table_args__ = (
        ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE', name='games_ibfk_1'),
        Index('games_ibfk_1', 'author_id')
    )

    id = mapped_column(INTEGER(11), primary_key=True)
    author_id = mapped_column(INTEGER(11), nullable=False)
    title = mapped_column(String(255), nullable=False)
    creation_date = mapped_column(Date, nullable=False, server_default=text('current_timestamp()'))
    coord_x = mapped_column(DECIMAL(10, 6), nullable=False)
    coord_y = mapped_column(DECIMAL(10, 6), nullable=False)
    description = mapped_column(Text, nullable=False)

    author: Mapped['Users'] = relationship('Users', back_populates='games')
    tag: Mapped['Tags'] = relationship('Tags', secondary='game_tags', back_populates='game')


t_login_details = Table(
    'login_details', metadata,
    Column('id', INTEGER(11), nullable=False),
    Column('login', String(255), nullable=False),
    Column('password', String(255), nullable=False),
    ForeignKeyConstraint(['id'], ['users.id'], ondelete='CASCADE', name='login_details_ibfk_1'),
    Index('login_details_ibfk_1', 'id')
)


t_tokens = Table(
    'tokens', metadata,
    Column('id', INTEGER(11), nullable=False),
    Column('expiration_time', DateTime, nullable=False),
    Column('token', String(255), nullable=False),
    ForeignKeyConstraint(['id'], ['users.id'], ondelete='CASCADE', name='tokens_ibfk_1'),
    Index('tokens_ibfk_1', 'id')
)


t_game_tags = Table(
    'game_tags', metadata,
    Column('game_id', INTEGER(11), primary_key=True, nullable=False),
    Column('tag_id', INTEGER(11), primary_key=True, nullable=False),
    ForeignKeyConstraint(['game_id'], ['games.id'], ondelete='CASCADE', name='game_tags_ibfk_1'),
    ForeignKeyConstraint(['tag_id'], ['tags.id'], ondelete='CASCADE', name='game_tags_ibfk_2'),
    Index('game_tags_ibfk_2', 'tag_id')
)
