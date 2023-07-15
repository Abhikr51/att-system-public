
# Automatic attendance with Realtime Technology


A attendance management system that helps a college ,institute or digital schools to take their attendance automatically. 

For every period a qr code link in sent to the assinged teacher's mail, teacher open that mail and that shows a QR code .Student also have a mobile application named "Attend ME" which is build on React Native can attend them by scanning the qr code from "Attend Me" application's scanner.

Later the admin can manage and see all the stored data.

## Features

- Student can make their attendance using just a qr code. 
- Managing all students' attendance for each subject, each period 
- Calculating total attendance percentage. 



## Run Locally

Clone the project

```bash
  git clone https://github.com/Abhikr51/att-system-public.git
```

Go to the project directory

```bash
  cd att-system-public
```

## For backend


Before this you have to make a .env file in `/backend/.env` refer the `.env` stucture given below.
```bash
  cd /backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## For frontend
```bash
  cd /frontend
```

Install dependencies

```bash
  npm install
```

Start the project

```bash
  npm start
```

## Environment Variables `.env`

```bash
HOST = "localhost"
PORT = 8000
SOCKET_PORT = 8080
DB_NAME = att-system
# MONGO_URI = 'mongodb://localhost:27017'
JWT_SECRET_KEY = YOUR_SECRET_KEY
SENDGRID_API_KEY= YOUR_SENDGRID_API_KEY
# FRONTEND_URL = "http://localhost:3000"
FRONTEND_URL_PORT = "3000"
FRONTEND_QR_SCAN_ENDPOINT = "/scanme" 
```


## Demo Video

[Click to view](https://drive.google.com/file/d/1ZiDkNmHorJrLCFLyhUSTlLbqnWEsSdwK/view?usp=drive_link)



## Screenshots

![Screenshot](https://abhikr51.github.io/screenshots/login.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/dashboard.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/show-attendance.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/students.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/teachers.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/add-data.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/Routine.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/upload-routine.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/mail-content.png)
___
![Screenshot](https://abhikr51.github.io/screenshots/qr-code.png)
___

## Attend Me application screenshots 
| | | |
| ---------------------- | ---------------------- | ---------------------- |
| ![image](https://abhikr51.github.io/screenshots/1.jpg) | ![imaeg](https://abhikr51.github.io/screenshots/2.jpg) | ![image](https://abhikr51.github.io/screenshots/3.jpg) | 
| ![imaeg](https://abhikr51.github.io/screenshots/4.jpg) | ![imaeg](https://abhikr51.github.io/screenshots/5.jpg) |




## Authors

- [@Abhik51](https://github.com/Abhikr51)

