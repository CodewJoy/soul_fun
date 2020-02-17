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
      myfriend: [],
      // friendlist: [],
      referlist: [],
      goToChat: false,
      friendID: '',
      isLoaded_friend: false,
      confirmfriend: []
    }
    this.addFriend = this.addFriend.bind(this);
    this.referFriends = this.referFriends.bind(this);
    this.friendInvite = this.friendInvite.bind(this);
    this.confirmFriend = this.confirmFriend.bind(this);
  }

  // 拿 user id 取值，換 router 於此才會拿到更新 context 中的 user id
  componentDidMount() {
    const { UserData, firebase } = this.props;
    const { isLoaded } = this.state;
    if (UserData.authUser) {
      this.referFriends(UserData, firebase, isLoaded);
    }
  }
  // 拿 user id 取值，重整畫面於此才會拿到更新 context 中的 user id
  componentDidUpdate() {
    const { UserData, firebase } = this.props;
    const { isLoaded } = this.state;
    this.referFriends(UserData, firebase, isLoaded);
  }
  referFriends(UserData, firebase, isLoaded) {
    // 加個鎖不然會無限 loading
    if (!isLoaded) {
      // 先取得我的朋友列表
      firebase.db.collection("Users").doc(UserData.authUser.uid).collection("friends")
        .onSnapshot(
          (querySnapshot) => {
            let myfriend = [];
            querySnapshot.forEach((doc) => {
              console.log('myfriend', doc.id, " => ", doc.data());
              myfriend.push(doc.data().id);
            })
            console.log('myfriend', myfriend);
            // 接著取得目前用戶列表
            firebase.db.collection("Users")
              .limit(20)
              .get()
              .then(
                (querySnapshot) => {
                  let friendlist = [];
                  querySnapshot.forEach((doc) => {
                    // if 有填資料再進來
                    if (doc.data().avatar) {
                      // cant see self as a friend
                      if (doc.id !== UserData.authUser.uid) {
                        console.log(doc.id, " => ", doc.data());
                        friendlist.push(doc.data().id);
                      }
                    }
                  });
                  // console.log('friendlist', friendlist);
                  // console.log(deleteIntersection(friendlist, myfriend));
                  let loaded = 0;
                  let refer = deleteIntersection(friendlist, myfriend);
                  let referlist = [];
                  for (let i = 0; i < refer.length; i++) {
                    firebase.db.collection("Users").doc(refer[i])
                      .onSnapshot(
                        (doc) => {
                          console.log("Document data:", doc.data());
                          referlist.push(doc.data());
                          loaded++;
                          if (loaded === refer.length) {
                            // console.log("document_try", document);
                            this.setState({ isLoaded: true, referlist, myfriend });
                          }
                        },
                        (error) => {
                          console.log(error)
                        }
                      )
                  }
                },
                (error) => {
                  console.log(error)
                  this.setState({
                    isLoaded: true,
                    error
                  })
                }
              )
          },
          (error) => {
            console.log(error)
          }
        )
    }
  }
  addFriend(id, name, avatar) {
    const { firebase, UserData } = this.props;
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
  }
  friendInvite() {
    const { firebase, UserData } = this.props;
    firebase.db.collection("Users").doc(UserData.authUser.uid).collection("friends")
      // .get()
      // .then(
      // use .onSnapshot() instead of .get() to get notice immediately
      .onSnapshot(
        (querySnapshot) => {
          let confirmfriend = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().status === "askUrConfirm") {
              console.log(doc.id, " => ", doc.data());
              confirmfriend.push(doc.data());
            }
          })
          this.setState({ confirmfriend });
        },
        (error) => {
          console.log(error)
        }
      )
    // )
  }
  confirmFriend(id, name, avatar) {
    const { firebase, UserData } = this.props;
    console.log(UserData);
    // modify my list
    firebase.db.collection("Users").doc(UserData.authUser.uid).collection("friends").doc(id)
      .update(
        {
          status: "confirm"
        }
      );
    // modify invited friend's list
    firebase.db.collection("Users").doc(id).collection("friends").doc(UserData.authUser.uid)
      .update(
        {
          status: "confirm"
        }
      )
    // 建立聊天室
    // createRoomID(uid1, uid2)
    let roomID = createRoomID(id, UserData.authUser.uid);
    console.log(roomID);

    // 同時設定文件欄位又設定他的子集合兩件事並不衝突
    firebase.db.collection("Room").doc(roomID)
      .set(
        {
          uid: [UserData.authUser.uid, id],
          user1: { uid: UserData.authUser.uid, avatar: UserData.userInfo.avatar, name: UserData.userInfo.username },
          user2: { uid: id, avatar: avatar, name: name },
          timestamp: Date.now()
        }
      )

    // 這段是要設給已經收到邀請後 confirm to chat 的頁面
    firebase.db.collection("Room").doc(roomID).collection("message").doc()
      .set(
        {
          sender: "admin",
          content: "You both are friends now. Let's message your friend.",
          timestamp: Date.now()
        }
      );

    // update context
    UserData.updateUserData({ friendID: id })
    this.setState({ goToChat: true, friendID: id });
  }
  render() {
    console.log('home', this.state);
    if (this.state.goToChat) {
      return <Redirect to="/message" />
    }
    // const { friendlist } = this.state
    const { error, isLoaded, referlist, confirmfriend } = this.state
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
          <div className="main">
            <div className="sideNav">
              <div className="discover-friends">Discover Friends</div>
              <div className="friend-requests" onClick={this.friendInvite}>Friend Requests</div>
              <div className="my-friend">My Friend Lists</div>
            </div>
            <Main referlist={referlist} addFriend={this.addFriend.bind(this)} />
            <ConfirmFriend confirmfriend={confirmfriend}
              confirmFriend={this.confirmFriend.bind(this)}
            />
          </div>
        </div>
      )
    }
  }
}

class ConfirmFriend extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit(id, name, avatar) {
    console.log(id, name, avatar);
    this.props.confirmFriend(id, name, avatar);
  }
  render() {
    console.log(this.props)
    const { confirmfriend } = this.props
    return (
      <div className="confirm-friend">
        <h3>Friend Invitation</h3>
        {confirmfriend.map(item => (
          <div className="confirm-box" key={item.id}>
            <img className="avatar" src={item.avatar} alt="avatar" />
            <div className="center">
              <h4>{item.name}</h4>
              <button onClick={this.handleSubmit.bind(this, item.id, item.name, item.avatar)}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

function deleteIntersection(nums1, nums2) {
  for (let i = 0; i < nums1.length; i++) {
    for (let j = 0; j < nums2.length; j++) {
      if (nums1[i] === nums2[j]) {
        // 從 nums1 中刪除重複的值
        nums1.splice(i, 1);
      }
    }
  }
  return nums1;
}

function createRoomID(uid1, uid2) {
  if (uid1 < uid2) {
    return uid1 + uid2;
  }
  else {
    return uid2 + uid1;
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
      <div className="container">
        {this.props.referlist.map(item => (
          <div key={item.id} className="friend-box">
            <img className="avatar" src={item.avatar} alt="avatar" />
            <p>
              <b>{item.username}</b>
            </p>
            <p>{item.country}</p>
            {/* <p>Country: {item.country}</p> */}
            <hr />
            <p>{item.language}</p>
            {/* <p>Language: {item.language}</p> */}
            <p>
              <b>{item.interest}</b>
              {/* <b>Interest: {item.interest}</b> */}
            </p>

            <button key={item.id} onClick={this.handleSubmit.bind(this, item.id, item.username, item.avatar)}>Add Friend</button>
          </div>
        ))}
      </div>
    )
  }
}

export default Home;