from typing import List, Optional

from sqlalchemy import Column, DECIMAL, Date, DateTime, ForeignKeyConstraint, Index, String, Table, Text, text
from sqlalchemy.dialects.mysql import INTEGER, LONGTEXT
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
    choice_tasks: Mapped[List['ChoiceTasks']] = relationship('ChoiceTasks', uselist=True, back_populates='game')
    location_tasks: Mapped[List['LocationTasks']] = relationship('LocationTasks', uselist=True, back_populates='game')
    number_tasks: Mapped[List['NumberTasks']] = relationship('NumberTasks', uselist=True, back_populates='game')
    text_tasks: Mapped[List['TextTasks']] = relationship('TextTasks', uselist=True, back_populates='game')


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


class ChoiceTasks(Base):
    __tablename__ = 'choice_tasks'
    __table_args__ = (
        ForeignKeyConstraint(['game_id'], ['games.id'], ondelete='CASCADE', name='choice_tasks_ibfk_1'),
        Index('game_id', 'game_id')
    )

    id = mapped_column(INTEGER(11), primary_key=True)
    task_number = mapped_column(INTEGER(11), nullable=False)
    coord_x = mapped_column(DECIMAL(10, 6), nullable=False)
    coord_y = mapped_column(DECIMAL(10, 6), nullable=False)
    points = mapped_column(INTEGER(11), nullable=False)
    question = mapped_column(String(255), nullable=False)
    options = mapped_column(LONGTEXT, nullable=False)
    correct_option_index = mapped_column(INTEGER(11), nullable=False)
    game_id = mapped_column(INTEGER(11))
    hints = mapped_column(LONGTEXT)

    game: Mapped[Optional['Games']] = relationship('Games', back_populates='choice_tasks')


t_game_tags = Table(
    'game_tags', metadata,
    Column('game_id', INTEGER(11), primary_key=True, nullable=False),
    Column('tag_id', INTEGER(11), primary_key=True, nullable=False),
    ForeignKeyConstraint(['game_id'], ['games.id'], ondelete='CASCADE', name='game_tags_ibfk_1'),
    ForeignKeyConstraint(['tag_id'], ['tags.id'], ondelete='CASCADE', name='game_tags_ibfk_2'),
    Index('game_tags_ibfk_2', 'tag_id')
)


class LocationTasks(Base):
    __tablename__ = 'location_tasks'
    __table_args__ = (
        ForeignKeyConstraint(['game_id'], ['games.id'], ondelete='CASCADE', name='location_task_ibfk_1'),
        Index('location_task_ibfk_1', 'game_id')
    )

    id = mapped_column(INTEGER(11), primary_key=True)
    task_number = mapped_column(INTEGER(11), nullable=False)
    coord_x = mapped_column(DECIMAL(10, 6), nullable=False)
    coord_y = mapped_column(DECIMAL(10, 6), nullable=False)
    points = mapped_column(INTEGER(11), nullable=False)
    question = mapped_column(String(255), nullable=False)
    hints = mapped_column(LONGTEXT, nullable=False)
    game_id = mapped_column(INTEGER(11))

    game: Mapped[Optional['Games']] = relationship('Games', back_populates='location_tasks')


class NumberTasks(Base):
    __tablename__ = 'number_tasks'
    __table_args__ = (
        ForeignKeyConstraint(['game_id'], ['games.id'], ondelete='CASCADE', name='number_tasks_ibfk_1'),
        Index('game_id', 'game_id')
    )

    id = mapped_column(INTEGER(11), primary_key=True)
    task_number = mapped_column(INTEGER(11), nullable=False)
    coord_x = mapped_column(DECIMAL(10, 6), nullable=False)
    coord_y = mapped_column(DECIMAL(10, 6), nullable=False)
    points = mapped_column(INTEGER(11), nullable=False)
    question = mapped_column(String(255), nullable=False)
    answer = mapped_column(INTEGER(11), nullable=False)
    game_id = mapped_column(INTEGER(11))
    hints = mapped_column(LONGTEXT)

    game: Mapped[Optional['Games']] = relationship('Games', back_populates='number_tasks')


class TextTasks(Base):
    __tablename__ = 'text_tasks'
    __table_args__ = (
        ForeignKeyConstraint(['game_id'], ['games.id'], ondelete='CASCADE', name='text_tasks_ibfk_1'),
        Index('game_id', 'game_id')
    )

    id = mapped_column(INTEGER(11), primary_key=True)
    task_number = mapped_column(INTEGER(11), nullable=False)
    coord_x = mapped_column(DECIMAL(10, 6), nullable=False)
    coord_y = mapped_column(DECIMAL(10, 6), nullable=False)
    points = mapped_column(INTEGER(11), nullable=False)
    question = mapped_column(String(255), nullable=False)
    answer = mapped_column(String(255), nullable=False)
    game_id = mapped_column(INTEGER(11))
    hints = mapped_column(LONGTEXT)

    game: Mapped[Optional['Games']] = relationship('Games', back_populates='text_tasks')
