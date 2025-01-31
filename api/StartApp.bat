@echo off

python -m venv apiVenv

call "apiVenv\scripts\activate"

pip install -r requirements.txt

sqlacodegen_v2 mysql://root:@localhost/erasmus --outfile .\api\models\models.py

uvicorn api.main:app --reload --host 0.0.0.0