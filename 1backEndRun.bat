@echo off

call angular_microservice_test\Scripts\activate

cd src\app\backEnd

py server_flask.py
cmd /k
