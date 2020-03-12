# SouLFun

SouLFun is a social Web application help you make friends with same interests. Concept inspired by [Bumble](https://bumble.com/) and [Slowly](https://www.getslowly.com/en/)

Demo: [https://soul-fun.firebaseapp.com/](https://soul-fun.firebaseapp.com/)

## Table of Contents
- [Technology](#Technology)
- [Features and Demo](#Features-and-Demo)
- [React Router Pages](#React-Router-Pages)

## Technology
Library and Framework
* React 
* Reac Context API
* React Router
* Material-UI

User Interface
* RWD
* Flexbox
* SPA

Cloud Service - Firebase
* Cloud Firestore
* Firebase Authentication
* Firebase Storage
* Firebase Hosting

Networking
* RESTful API
* AJAX

Tools
* Git, GitHub
* Lint Tool - ESLint
* Unit Testing - Jest

## Features and Demo
### Use Firebase Authentication to Log in, Sign up and Log out

| ![](https://i.imgur.com/IYTjOu6.png) | ![](https://i.imgur.com/S6iteDb.png)|
| -------- | -------- |

### Enter Account page
* Upload photo and save by Firestore Storage
* Deat with React Forms and use Autocomplete and Datepicker of Material-UI

| ![](https://i.imgur.com/SIXmbWX.png) | ![](https://i.imgur.com/UZwj1ZA.png) |
| -------- | -------- |

### Match friends with Interst Tags - use Nesting Router here

* Discover friends
-Select Friends by Interest. Refer friends and **sort by friend's last online time**.
-See the basic info of person you interested in, including their interests tags.
-Add friends here.
* Friend Requests
-See the **friend invitation alert** and their basic info here.
-If accept friend invitation, redirect to message page and chat with friend.
* My friend
-See your all friends here. Click and chat with them.

| ![](https://i.imgur.com/aqYuUap.png)| ![](https://i.imgur.com/4Jg99oK.png)|
| -------- | -------- |

### Instant Chat with friends
- Sort chat room by time.
- Click room and talk.
- Send Message. Use Firestore onSnapshot to get the instant messages.
- Save the message unsent of different rooms.

| ![](https://i.imgur.com/p5m58yy.png)| ![](https://i.imgur.com/ZBNOYVF.png) |
| -------- | -------- |

## React Router Pages
### Landing/index.js
![](https://i.imgur.com/yDasNNM.png)
### Profile/index.js
![](https://i.imgur.com/XcFd4yz.png)
### Home/index.js
![](https://i.imgur.com/CAWQd7R.png)
### Message/index.js
![](https://i.imgur.com/UGpl5lf.png)

## Contact
Email: yichen.hung6699@gmail.com
