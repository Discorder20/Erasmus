from sqlalchemy import create_engine

from sqlalchemy.orm import declarative_base, sessionmaker

from sqlalchemy import URL

url_object = URL.create(
    "mysql",
    username="root",
    password="",
    host="localhost",
    database="erasmus",
)


engine = create_engine(url_object, pool_size=100, max_overflow=0)

Session = sessionmaker(engine)

Base = declarative_base()

def getDB():
    db = Session
    try:
        yield db
    finally:
        db.close()