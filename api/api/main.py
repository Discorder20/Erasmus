from fastapi import *
from pydantic import *
from jwt import *
from datetime import *

from sqlalchemy import *
from sqlalchemy.orm import Session

from api.models.models import *
from database.config import engine

app = FastAPI()
key = "erasmusApiTokenKey"
session = Session(engine)

@app.get('/')
def readMain():
    return {"Hello":"World"}


@app.post('/user')
def getUser(idUser : int):
    statement = select(Users.first_name, Users.last_name,t_login_details.c.login,t_login_details.c.password).join_from(Users, t_login_details).where(Users.id == idUser)
    rowData = {}
    for row in session.execute(statement):
        rowData = {"FirstName":row.first_name, "LastName":row.last_name, "Login":row.login, "Password":row.password}        
    if rowData:
        return rowData
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

@app.post("/singup")
def singUp(loginUser : str, passwordUser : str,firstName : str,lastName : str, email : str, phoneNumber : str):
    idUser = 1
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
    with engine.connect() as conn:
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
def logIn(loginUser : str, passwordUser : str):
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
        with engine.connect() as conn:
            statement = insert(t_tokens).values(id = userData[0],expiration_time = expaire,token = tokenUser)
            result = conn.execute(statement)
            conn.commit()
            return {"token":tokenUser}
    else:
        if datetime.now() < datetime.strptime(tokenData[2], '%y/%m/%d %H:%M:%S.%f'):
            return {"token":tokenData[1]}
        else:
            with engine.connect() as conn:
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