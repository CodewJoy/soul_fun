# SouLFun

SouLFun is a social Web application help you make friends with same interests. Concept inspired by [Bumble](https://bumble.com/) and [Slowly](https://www.getslowly.com/en/)

Demo: [https://soul-fun.firebaseapp.com/](https://soul-fun.firebaseapp.com/)

## Table of Contents
- [Technology](#Technology)
- [Features and Demo](#Features-and-Demo)
- [RWD on mobile device](#RWD-on-mobile-device)

## Technology
**Library and Framework**
* React 
* Reac Context API
* React Router
* Material-UI

**User Interface**
* RWD
* Flexbox

**Cloud Service - Firebase**
* Cloud Firestore
* Firebase Authentication
* Firebase Storage
* Firebase Hosting

**Networking**
* RESTful API
* AJAX

**Tools**
* Git, GitHub
* Lint Tool - ESLint
* Unit Testing - Jest

## Demo
### Use Firebase Authentication to Log in, Sign up and Log out
![](https://i.imgur.com/yDasNNM.png)

### Enter Account page
* Upload photo and save by Firestore Storage
* Deat with React Forms and use Autocomplete and Datepicker of Material-UI

![](https://i.imgur.com/XcFd4yz.png)

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

![](https://i.imgur.com/otMoOKW.gif)


### Instant Chat with friends
- Sort chat room by time.
- Click room and talk.
- Send Message. Use Firestore onSnapshot to get the instant messages.
- Save the message unsent of different rooms.

![](https://i.imgur.com/V05D92U.gif)

### RWD on mobile device


| ![](https://i.imgur.com/FXSsv7W.png)| ![](https://i.imgur.com/EaWU9Hl.png) | 
| -------- | -------- | 

| ![](https://i.imgur.com/h6wdoZQ.png) | ![](https://i.imgur.com/4FF7oUT.png) | 
| -------- | -------- | 

## Contact
Email: yichen.hung6699@gmail.com
