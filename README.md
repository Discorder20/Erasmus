# Repository of the Api(v 0.2)

## What Api do now
- Returns FirsName, LastName, login and password of specific user by his id
- Can Create a new user and save him in database
- Can generate token save it check if it is actual and update if not
- Can login by token and login and password
- Search game by filter and sort it
- Getting all cities in database
- Create new game

## List of Tasks
- [x] Integrate with Render
- [x] Sign up of user
- [x] Log in of user
- [x] Tokens generating, sending, saving and checking / Sessions
- [x] Searching of games by many filter and by sorting
- [x] Geting all cities
- [x] Creating new games

> [!IMPORTANT]
> **How to start up Api on your system (in actual state of App and database)**
> 1. First of all you need to import database to your phpmyadmin, name it erasmus. Database is in db directory
> 2. You have to have user name root without password and your server must running on localhost
> 3. If u are doing it on local machine u have to go to ./api/database/config.py and change variable isLocal to true
> 4. In this step all you need to do is double click on file named StartApp.bat it will lunch Api server with all dependency
> 5. Api will start on 127.0.0.1:8000/docs
> 
> **How to start up Api in network**
> 1. You have to go on this website "https://aiven.io/" and log in by email and password of the erasmus mail account (it is on discord of erasmus in info/links section)
> 2. Next you have to click on three dots and  click power on service
> 3. Next go to website "https://render.com/" and login with the same data, that were used in aiven
> 4. Next click service named ErasmusApi, click Manual Deploy and click deploy latest commit
> 5. Last just copy and paste the url that is showed on the same page under name of service 

> [!NOTE]
> **If u have trouble with api, just write it on discord server of erasmus in tab Api chat reports**

> [!TIP]
> **Remeber that the Swager window of the api is on 127.0.0.1:8000/docs**