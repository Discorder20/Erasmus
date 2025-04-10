from fastapi import *
from pydantic import *
from jwt import *
from datetime import *
from math import *
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler  # runs tasks in the background
from apscheduler.triggers.cron import CronTrigger  # allows us to specify a recurring time for execution

from sqlalchemy import *
from sqlalchemy.orm import Session

from api.models.models import *
from database.config import engine


app = FastAPI()
privateKey=b"-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgGZyhuhfsywUuAalM2sBd39j/erJU7t8z0RAvBXiCEoaUZ1Iqfhj\nuzFo/iapLaD/6rNHVkneGhSClumRkUpyvz6gTk9XEK8WcA6P4bQAqzwjzgShoXlO\n8zIRY90nMVsWQCK4y0BnPVR1L7hT7rNBqvS844NTokwfN0Rj7RqggKzXAgMBAAEC\ngYBes6PuDvkr2IM88V2Unyh9xEsmzLDwcbGPoF+9wtJy3d1wDYnBqT+Tr0CxMFaT\nq76jt2AWrI9jQkyK4RtzvJr3786gKcQUJALc9CHc9/zdf/Vva2MMu3D/oLX2MLVy\nNUyNtGptRwTAPP3OpyVKFukRpFUbvPfO90CPoB6wsEHcMQJBAMyP9IXJf9NNWzPo\nU0/jj4vyYVrMsBpwLSFmNzkFCev4s3B0to7mJo1IWHHcr9WWOeslzjwHqRiEOXNs\nUUwkLzsCQQCANT+guViOIO4iXcIcJY3Tp+JjT254JANZjvT7RAtpuFuCwNUbU2vu\ndBL/QM2lNzeoI+rzzleth/iODUlsN5cVAkEAwKkkR40L0tscdrrtHGTaoZfakUYO\n5heYqcg3YoCYY6KMffGurs+cp5vnkPWktakTS6EDqA4e+HQwF8GAoBHEWQJAQk3H\ngzJ3lsF3BjTg3zeYun5XeS6qHd3aEaX6Ejwlft5GDT/2tjQVXHORI4r7D1eYJA+3\nQbFT7L2mEKjUcO/q5QJBAL1LTYmhc5LIUg+btQvM1gJyE/m/J09zBty8rVlB5aco\nHAu4xudgho+at24U+VjoQtF0fTSeoDTEu5rzDuM4Pqc=\n-----END RSA PRIVATE KEY-----\n"
publicKey=b"-----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGZyhuhfsywUuAalM2sBd39j/erJ\nU7t8z0RAvBXiCEoaUZ1IqfhjuzFo/iapLaD/6rNHVkneGhSClumRkUpyvz6gTk9X\nEK8WcA6P4bQAqzwjzgShoXlO8zIRY90nMVsWQCK4y0BnPVR1L7hT7rNBqvS844NT\nokwfN0Rj7RqggKzXAgMBAAE=\n-----END PUBLIC KEY-----\n"
key = "erasmusApiTokenKey"
session = Session(engine)


def croneFunction():
    statement = Select(Users)
    session.execute(statement)
    print("Crone function works")

scheduler = BackgroundScheduler()
scheduler.add_job(croneFunction, 'interval' , seconds=5)
scheduler.start()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    scheduler.shutdown()

@app.get('/')
def readMain():
    return {"Hello":"World"}


@app.post('/user')
def getUser(idUser : int):
    statement = select(Users.first_name, Users.last_name,t_login_details.c.login,t_login_details.c.password).join_from(Users, t_login_details).where(Users.id == idUser)
    rowData = {}
    for row in session.execute(statement):
        password = decode(row.password, publicKey, algorithms=["RS256"])
        rowData = {"FirstName":row.first_name, "LastName":row.last_name, "Login":row.login, "Password":password["password"]}        
    if rowData:
        return rowData
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

@app.post('/tags')
def getTags(skip : int = 0):
    statement = select(Tags)
    tagsData = []
    for row in session.execute(statement):
        tagsData.append({"id" : row.Tags.id, "name" : row.Tags.name})
    return tagsData[skip : skip+len(tagsData)]

@app.post("/cities")
def getCities(skip : int = 0):
    statement = select(Cities)
    citiesData = []
    for row in session.execute(statement):
        citiesData.append({"id" : row.Cities.id, "name" : row.Cities.name, "coordX" : row.Cities.coord_x, "coordY" : row.Cities.coord_y})
    return citiesData[skip : skip+len(citiesData)]


@app.post("/signup")
def signUp(loginUser : str, password : str,firstName : str,lastName : str, email : str, phoneNumber : str):
    idUser = 1
    passwordUser = encode({"password":password}, privateKey, algorithm="RS256")
    statement = select(Users)
    for row in session.execute(statement):
        idUser += 1
    statement = select(t_login_details.c.login,t_login_details.c.password).where(t_login_details.c.login == loginUser)
    for row in session.execute(statement):
        if row.login == loginUser:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists",
            )
    with session as conn:
            insertStatement = insert(Users).values(id = idUser, first_name = firstName, last_name = lastName, email = email, phone_number = phoneNumber)
            result = conn.execute(insertStatement)
            conn.commit()
            insertStatement = insert(t_login_details).values(id = idUser, login = loginUser, password = passwordUser)
            result = conn.execute(insertStatement)
            conn.commit()
            expaire = str(datetime.now() + timedelta(days=7))
            tokenUser = encode({"id" : idUser,"user" : loginUser, "password" : passwordUser, "expire" : expaire}, key, algorithm='HS256')
            statement = insert(t_tokens).values(id = idUser,expiration_time = expaire,token = tokenUser)
            result = conn.execute(statement)
            conn.commit()
            return {"token":tokenUser}


@app.post("/login")
def logIn(loginUser : str, password : str):
    passwordUser = encode({"password":password}, privateKey, algorithm="RS256")
    statement = select(t_login_details.c.id, t_login_details.c.login, t_login_details.c.password).where(t_login_details.c.login == loginUser)
    userData = []
    for row in session.execute(statement):
        if row.login == loginUser:
            if row.password == passwordUser:
                userData = [row.id,row.login,row.password] 
            else:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Hasło nie poprawne",
                )
    if userData == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brak użytkownika w bazie",
        )
    expaire = str(datetime.now() + timedelta(days=7))
    tokenUser = encode({"id" : userData[0],"user" : userData[1], "password" : userData[2], "expire" : expaire}, key, algorithm='HS256')
    tokenData = []
    statement = select(t_tokens.c.id, t_tokens.c.token, t_tokens.c.expiration_time).where(t_tokens.c.id == userData[0])
    for row in engine.connect().execute(statement):
        tokenData = [row.id, row.token, row.expiration_time]
    if tokenData == []:
        with session as conn:
            statement = insert(t_tokens).values(id = userData[0],expiration_time = expaire,token = tokenUser)
            result = conn.execute(statement)
            conn.commit()
            return {"token":tokenUser}
    else:
        if datetime.now() < tokenData[2]:
            return {"token":tokenData[1]}
        else:
            with session as conn:
                statement = update(t_tokens).where(t_tokens.c.id == tokenData[0]).values(expiration_time = expaire)
                result = conn.execute(statement)
                conn.commit()
                return {"token":tokenUser}


                
@app.post("/loginByToken")
def logInByToken(userToken : str):
    userData = decode(userToken, key, algorithms=["HS256"])
    if datetime.now() > datetime.strptime(userData["expire"], '%Y-%m-%d %H:%M:%S.%f'):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Token wygasł zloguj sie ponownie",
        )
    statement = select(t_login_details.c.id, t_login_details.c.login, t_login_details.c.password).where(t_login_details.c.login == userData["user"])
    for row in session.execute(statement):
        if row.login == userData["user"]:
            if row.password == userData["password"]:
                raise HTTPException(
                    status_code=status.HTTP_202_ACCEPTED,
                    detail="Zalogowano",
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Token jest błędny",
                )
    if userData == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brak użytkownika w bazie",
        )

@app.post("/addNewGame")
def addNewGame(userToken : str, title : str, coordX : float, coordY : float, description : str, tag : list[str]):
    idGame = 1
    actualTag = 0
    statement = select(Games)
    for row in session.execute(statement):
        idGame += 1
    userData = decode(userToken, key, algorithms=["HS256"])
    with session as conn:
        insertStatement = insert(Games).values(id = idGame, author_id = userData["id"], title = title, creation_date = datetime.date(datetime.now()), coord_x = coordX, coord_y = coordY, description = description)
        result = conn.execute(insertStatement)
        conn.commit()
        tags = getTags()
        for i in tags:
            if i["name"] == tag[actualTag]:
                insertStatement = insert(t_game_tags).values(game_id = idGame,tag_id = i["id"])
                result = conn.execute(insertStatement)
                conn.commit()
                if actualTag < len(tag) - 1:
                    actualTag+=1
        
        raise HTTPException(
            status_code=status.HTTP_201_CREATED,
            detail="New game created",
        )


@app.post("/searchForGame")
def searchForGame(tag : str = "", name : str = "", author : str = "", date : str = "", city : str = "", sort : str = "id", skip : int = 0):
    tasks = []
    tags = []
    citiesData = getCities()
    cityVal = ""
    gameData = []
    minLength = 0
    criteria = [(Games.title, name), (Users.first_name, author), (Games.creation_date, date)]

    statement= select(Games.id, Games.title, Games.creation_date, Games.coord_x, Games.coord_y, Games.description, Users.first_name).join(Users,  Games.author_id == Users.id)

    statementTags = select(Games.id, Games.title, Games.creation_date, Games.coord_x, Games.coord_y, Games.description, Tags.name, Users.first_name).join(t_game_tags, Games.id == t_game_tags.c.game_id).join(Tags, t_game_tags.c.tag_id == Tags.id).join(Users,  Games.author_id == Users.id)

    statementChoiceTasks = select(Games.id, Games.title, Games.creation_date, Games.description, Users.first_name, ChoiceTasks.task_number, ChoiceTasks.coord_x, ChoiceTasks.coord_y, ChoiceTasks.points, ChoiceTasks.question, ChoiceTasks.options, ChoiceTasks.correct_option_index, ChoiceTasks.hints).join(Users,  Games.author_id == Users.id).join(ChoiceTasks, ChoiceTasks.game_id == Games.id)

    statementNumberTasks = select(Games.id, Games.title, Games.creation_date, Games.description, Users.first_name,  NumberTasks.task_number, NumberTasks.coord_x, NumberTasks.coord_y, NumberTasks.points, NumberTasks.question, NumberTasks.answer, NumberTasks.hints).join(Users,  Games.author_id == Users.id).join(NumberTasks, NumberTasks.game_id == Games.id)

    statementTextTasks = select(Games.id, Games.title, Games.creation_date, Games.description, Users.first_name,  TextTasks.task_number, TextTasks.coord_x, TextTasks.coord_y, TextTasks.points, TextTasks.question, TextTasks.answer, TextTasks.hints).join(Users,  Games.author_id == Users.id).join(TextTasks, TextTasks.game_id == Games.id)

    statementLocationTasks = select(Games.id, Games.title, Games.creation_date, Games.description, Users.first_name,  LocationTasks.task_number, LocationTasks.coord_x, LocationTasks.coord_y, LocationTasks.points, LocationTasks.question, LocationTasks.hints).join(Users,  Games.author_id == Users.id).join(LocationTasks, LocationTasks.game_id == Games.id)

    for crit in criteria:
        col, val = crit
        if val != "":
            statement = statement.where(col == val)
            statementTags = statementTags.where(col == val)
            statementChoiceTasks = statementChoiceTasks.where(col == val)
            statementNumberTasks = statementNumberTasks.where(col == val)
            statementTextTasks = statementTextTasks.where(col == val)
            statementLocationTasks = statementLocationTasks.where(col == val)
    

            
    for rowChoiceTasks in engine.connect().execute(statementChoiceTasks):
        tasks.append({"Task Type":"Choice Task", "Game Id": rowChoiceTasks.id,"Task Number":rowChoiceTasks.task_number, "CoordX" : rowChoiceTasks.coord_x, "CoordY" : rowChoiceTasks.coord_y, "Points" : rowChoiceTasks.points, "Question" : rowChoiceTasks.question, "Options" : rowChoiceTasks.options, "Corrcect Option Index" : rowChoiceTasks.correct_option_index, "Hints" : rowChoiceTasks.hints})

    for rowNumberTasks in engine.connect().execute(statementNumberTasks):
        tasks.append({"Task Type":"Number Task", "Game Id": rowNumberTasks.id, "Task Number":rowNumberTasks.task_number, "CoordX" : rowNumberTasks.coord_x, "CoordY" : rowNumberTasks.coord_y, "Points" : rowNumberTasks.points, "Question" : rowNumberTasks.question, "Answer" : rowNumberTasks.answer, "Hints" : rowNumberTasks.hints})

    for rowTextTasks in engine.connect().execute(statementTextTasks):
        tasks.append({"Task Type":"Text Task", "Game Id": rowTextTasks.id,"Task Number":rowTextTasks.task_number, "CoordX" : rowTextTasks.coord_x, "CoordY" : rowTextTasks.coord_y, "Points" : rowTextTasks.points, "Question" : rowTextTasks.question, "Answer" : rowTextTasks.answer, "Hints" : rowTextTasks.hints})

    for rowLocationTasks in engine.connect().execute(statementLocationTasks):
        tasks.append({"Task Type":"Location Task", "Game Id": rowLocationTasks.id, "Task Number":rowLocationTasks.task_number, "CoordX" : rowLocationTasks.coord_x, "CoordY" : rowLocationTasks.coord_y, "Points" : rowLocationTasks.points, "Question" : rowLocationTasks.question, "Hints" : rowLocationTasks.hints})
    
    for rowTags in engine.connect().execute(statementTags):
        tags.append({"id":rowTags.id,"name":rowTags.name})

    for row in session.execute(statement):
        gameTasks = []
        gameTags = []

        for cityInteger in citiesData:
            length =  sqrt(pow(float(cityInteger["coordX"]) - float(row.coord_x),2) + pow(float(cityInteger["coordX"]) - float(row.coord_y),2))
            if minLength == 0:
                minLength = length
                cityVal=cityInteger["name"]
            elif minLength > length:
                minLength = length
                cityVal=cityInteger["name"]

        for rowTags in tags:
            if rowTags["id"] == row.id:
                gameTags.append(rowTags["name"]) 
        for rowTasks in tasks:
            if rowTasks["Game Id"] == row.id:
                gameTasks.append(rowTasks)

        if city != "" or tag != "":
            if city == cityVal:
                gameData.append({"id" : row.id, "title" : row.title, "DateOfCreation" : row.creation_date, "Description" : row.description, "Tags":gameTags, "City":cityVal,"User":row.first_name,"Tasks" : gameTasks})
            elif tag in gameTags:
                gameData.append({"id" : row.id, "title" : row.title, "DateOfCreation" : row.creation_date, "Description" : row.description, "Tags":gameTags, "City":cityVal,"User":row.first_name,"Tasks" : gameTasks})
        else:
            gameData.append({"id" : row.id, "title" : row.title, "DateOfCreation" : row.creation_date, "Description" : row.description, "Tags":gameTags, "City":cityVal,"User":row.first_name,"Tasks" :  gameTasks})
    return gameData[skip : skip+len(gameData)]    


# @app.post("/searchForGameTags")
# def searchForGameTags(data : str,sort : str = "id",skip : int = 0):
#     citiesData = getCities()
#     statement= select(Games.id, Games.title, Games.creation_date, Games.coord_x, Games.coord_y, Games.description, Tags.name, Users.first_name).join(t_game_tags, Games.id == t_game_tags.c.game_id).join(Tags, t_game_tags.c.tag_id == Tags.id).join(Users,  Games.author_id == Users.id).where(Tags.name == data).order_by(sort)
#     gameData = []
#     city=""
#     print(citiesData[0])
#     for row in session.execute(statement):
#         for cityInteger in citiesData:
#             if(float(cityInteger["coordX"]) - 100.0 <= float(row.coord_x) and float(cityInteger["coordX"]) + 100.0 >= float(row.coord_x) and float(cityInteger["coordY"]) - 100.0 <= float(row.coord_y) and float(cityInteger["coordY"]) + 100.0 >= float(row.coord_y)):
#                 city=cityInteger["name"]
#         gameData.append({"id" : row.id, "title" : row.title, "DateOfCreation" : row.creation_date, "Description" : row.description, "Tag":row.name, "City":city,"User":row.first_name})
#     return gameData[skip : skip+len(gameData)]

# @app.post("/searchForGameName")
# def searchForGameName(data : str,sort : str = "id",skip : int = 0):
#     citiesData = getCities()
#     statement= select(Games.id, Games.title, Games.creation_date, Games.coord_x, Games.coord_y, Games.description, Tags.name, Users.first_name).join(t_game_tags, Games.id == t_game_tags.c.game_id).join(Tags, t_game_tags.c.tag_id == Tags.id).join(Users,  Games.author_id == Users.id).where(Games.title == data).order_by(sort)
#     gameData = []
#     city=""
#     print(citiesData[0])
#     for row in session.execute(statement):
#         for cityInteger in citiesData:
#             if(float(cityInteger["coordX"]) - 100.0 <= float(row.coord_x) and float(cityInteger["coordX"]) + 100.0 >= float(row.coord_x) and float(cityInteger["coordY"]) - 100.0 <= float(row.coord_y) and float(cityInteger["coordY"]) + 100.0 >= float(row.coord_y)):
#                 city=cityInteger["name"]
#         gameData.append({"id" : row.id, "title" : row.title, "DateOfCreation" : row.creation_date, "Description" : row.description, "Tag":row.name, "City":city,"User":row.first_name})
#     return gameData[skip : skip+len(gameData)]

# @app.post("/searchForGameAuthor")
# def searchForGameAuthor(data : str,sort : str = "id",skip : int = 0):
#     citiesData = getCities()
#     statement= select(Games.id, Games.title, Games.creation_date, Games.coord_x, Games.coord_y, Games.description, Tags.name, Users.first_name).join(t_game_tags, Games.id == t_game_tags.c.game_id).join(Tags, t_game_tags.c.tag_id == Tags.id).join(Users,  Games.author_id == Users.id).where(Users.first_name == data).order_by(sort)
#     gameData = []
#     city=""
#     print(citiesData[0])
#     for row in session.execute(statement):
#         for cityInteger in citiesData:
#             if(float(cityInteger["coordX"]) - 100.0 <= float(row.coord_x) and float(cityInteger["coordX"]) + 100.0 >= float(row.coord_x) and float(cityInteger["coordY"]) - 100.0 <= float(row.coord_y) and float(cityInteger["coordY"]) + 100.0 >= float(row.coord_y)):
#                 city=cityInteger["name"]
#         gameData.append({"id" : row.id, "title" : row.title, "DateOfCreation" : row.creation_date, "Description" : row.description, "Tag":row.name, "City":city,"User":row.first_name})
#     return gameData[skip : skip+len(gameData)]

# @app.post("/searchForGameDate")
# def searchForGameDate(data : str,sort : str = "id",skip : int = 0):
#     citiesData = getCities()
#     statement= select(Games.id, Games.title, Games.creation_date, Games.coord_x, Games.coord_y, Games.description, Tags.name, Users.first_name).join(t_game_tags, Games.id == t_game_tags.c.game_id).join(Tags, t_game_tags.c.tag_id == Tags.id).join(Users,  Games.author_id == Users.id).where(Games.creation_date == data).order_by(sort)
#     gameData = []
#     city=""
#     print(citiesData[0])
#     for row in session.execute(statement):
#         for cityInteger in citiesData:
#             if(float(cityInteger["coordX"]) - 100.0 <= float(row.coord_x) and float(cityInteger["coordX"]) + 100.0 >= float(row.coord_x) and float(cityInteger["coordY"]) - 100.0 <= float(row.coord_y) and float(cityInteger["coordY"]) + 100.0 >= float(row.coord_y)):
#                 city=cityInteger["name"]
#         gameData.append({"id" : row.id, "title" : row.title, "DateOfCreation" : row.creation_date, "Description" : row.description, "Tag":row.name, "City":city,"User":row.first_name})
#     return gameData[skip : skip+len(gameData)]

# @app.post("/searchForGameCity")
# def searchForGame(data : str,sort : str = "id",skip : int = 0):
#     citiesData = getCities()
#     statement= select(Games.id, Games.title, Games.creation_date, Games.coord_x, Games.coord_y, Games.description, Tags.name, Users.first_name).join(t_game_tags, Games.id == t_game_tags.c.game_id).join(Tags, t_game_tags.c.tag_id == Tags.id).join(Users,  Games.author_id == Users.id).order_by(sort)
#     gameData = []
#     city=""
#     print(citiesData[0])
#     for row in session.execute(statement):
#         for cityInteger in citiesData:
#             if(float(cityInteger["coordX"]) - 100.0 <= float(row.coord_x) and float(cityInteger["coordX"]) + 100.0 >= float(row.coord_x) and float(cityInteger["coordY"]) - 100.0 <= float(row.coord_y) and float(cityInteger["coordY"]) + 100.0 >= float(row.coord_y)):
#                 city=cityInteger["name"]
#         if(city == data):
#             gameData.append({"id" : row.id, "title" : row.title, "DateOfCreation" : row.creation_date, "Description" : row.description, "Tag":row.name, "City":city,"User":row.first_name})
#     return gameData[skip : skip+len(gameData)]
