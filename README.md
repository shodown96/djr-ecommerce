# Django React Ecommerce

This repository contains an Ecommerce project using Django and React. The project features Django Rest Framework and Rest Auth for the Backend, React Redux, MDB for the frontend

[Watch the tutorial on how to integrate Django and React](https://youtu.be/YKYVv0gm_0o)

## Backend development workflow

```json
virtualenv env
source env/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

## Frontend development workflow

```json
Create the file "src/apikeys.js" and export your stripe and paystack apikeys from there
npm i
npm start
```

## For deploying

```json
npm run build
```
