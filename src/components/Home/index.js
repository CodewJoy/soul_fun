/* eslint-disable no-undef */
import React, { Component } from 'react';
import Navigation from '../App/navigation.js';
import './home.css';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import Logo from '../img/logo.svg';
import Loading from '../img/loading.gif';
import { Redirect } from 'react-router-dom';

const Home = () => (
  <>
    <AuthUserContext.Consumer>
      {UserData => (
        <FirebaseContext.Consumer>
          {(firebase) => <HomeBase
            UserData={UserData} firebase={firebase} />}
        </FirebaseContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

class HomeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      friendlist: [],
      goToChat: false,
      friendID : ''
    }
    this.addFriend = this.addFriend.bind(this);
    this.referFriends = this.referFriends.bind(this)
  }

  // 拿 user id 取值，換 router 於此才會拿到更新 context 中的 user id
  componentDidMount() {
    const { UserData, firebase } = this.props;
    const { isLoaded } = this.state;
    if (UserData.authUser) {
      this.referFriends(UserData, firebase, isLoaded);
    }
  }
  referFriends(UserData, firebase, isLoaded) {
    if (!isLoaded) {
      firebase.db.collection("Users")
        .get()
        .then(
          (querySnapshot) => {
            let friendlist = [];
            querySnapshot.forEach((doc) => {
              // if (!doc.data().status) {
                if (doc.data().avatar) {
                  // cant see self as a friend
                  if (doc.id !== UserData.authUser.uid) {
                    console.log(doc.id, " => ", doc.data());
                    friendlist.push(doc.data());
                  }
                }
              // }
            });
            this.setState({
              isLoaded: true, friendlist
            })
            console.log(this.state)
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            })
          }
        )
    }
  }
// 拿 user id 取值，重整畫面於此才會拿到更新 context 中的 user id
  componentDidUpdate() {
    const { UserData, firebase } = this.props;
    const { isLoaded } = this.state;
    this.referFriends(UserData, firebase, isLoaded);
  }
  addFriend(id, name, avatar) {
    const { firebase, UserData } = this.props
    console.log(UserData);
    // modify my list
    firebase.db.collection("Users").doc(UserData.authUser.uid).collection("friends").doc(id)
      .set(
        {
          id: id,
          name: name,
          avatar: avatar,
          status: "waitHisConfirm"
        }
      );
    // modify invited friend's list
    firebase.db.collection("Users").doc(id).collection("friends").doc(UserData.authUser.uid)
      .set(
        {
          id: UserData.authUser.uid,
          name: UserData.userInfo.username,
          avatar: UserData.userInfo.avatar,
          status: "askUrConfirm"
        }
      )
    
    // createRoomID(uid1, uid2)
    let roomID = createRoomID(id, UserData.authUser.uid);
    console.log(roomID);
 
    // 怎麼同時設定文件欄位又設定他的子集合
    // 目前嘗試用 callback 
    (() => firebase.db.collection("Room").doc(roomID)
    .set(
      {
        uid: [UserData.authUser.uid, id],
        user1: { uid: UserData.authUser.uid, avatar: UserData.userInfo.avatar, name: UserData.userInfo.username},
        user2: { uid: id, avatar: avatar, name: name}, 
        timestamp: Date.now()
      }
    ))(firebase.db.collection("Room").doc(roomID).collection("message").doc()
    .set(
      {
        sender: "admin",
        content: "Say hi to your new friend. :)",
        timestamp: Date.now()
      }
    ));
    
    // update context
    UserData.updateUserData({friendID: id})
    this.setState({ goToChat: true, friendID: id });
  }

  render() {
    if(this.state.goToChat){
      return <Redirect to="/message" />
    }
    // const { friendlist } = this.state
    const { error, isLoaded, friendlist } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div className="loading"><img src={Loading} alt="Loading" /></div>
    } else {
      return (
        <div className="home">
          <div className="navbar">
            <div className="logo">
              <img className="logo-img" src={Logo} alt="Logo" />
              <h3>SOULFUN</h3>
            </div>
            <Navigation />
          </div>
          <Main friendlist={friendlist} addFriend={this.addFriend.bind(this)} />
        </div>
      )
    }
  }
}
function createRoomID(uid1, uid2) {
  if (uid1 < uid2) {
    return uid1+uid2;  
    }
  else {
    return uid2+uid1;
  }
}

class Main extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    // this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(id, name, avatar) {
    // console.log(id, name, avatar);
    this.props.addFriend(id, name, avatar);
  }
  render() {
    return (
      <div className="main">
        <div className="container">
          {this.props.friendlist.map(item => (
            <div key={item.id} className="friend-box">
              <img className="avatar" src={item.avatar} alt="avatar" />
              <h3>{item.username}</h3>
              <p>Country: {item.country}</p>
              <hr />
              <p>Language: {item.language}</p>
              <h4>Interest: {item.interest}</h4>
              <button key={item.id} onClick={this.handleSubmit.bind(this, item.id, item.username, item.avatar)}>Add Friend</button>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Home;