/* eslint-disable no-undef */
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './home.css';
import Navbar from '../Header';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import { INTERESTS } from '../../constants/factor.js';
import { Redirect } from 'react-router-dom';

import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Badge } from '@material-ui/core';

import Loading from '../img/loading.gif';
import Discover from '../img/discover.svg';
import Invitation from '../img/invitation.svg';
import Myfriend from '../img/my_friend.svg';


const Home = () => (
  <>
    <AuthUserContext.Consumer>
      {userData => (
        <FirebaseContext.Consumer>
          {(firebase) => <HomeBase
            userData={userData} firebase={firebase} />}
        </FirebaseContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

class HomeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'discover',
    }
    this.sideNav = this.sideNav.bind(this);
  }
  sideNav(name) {
    this.setState({ selected: name });
  }
  render() {
    return (
      <div className="home">
        <Navbar />
        <div className="main">
          <ul className="sideNav">
            <Link to='/home' className={this.state.selected === 'discover' ? "active" : "none"} onClick={() => this.sideNav('discover')}>
              <li className="center">
                <img src={Discover} alt="discover" className="home-icon" />
                <p className="home-sidenav">&emsp;Discover Friends</p>
              </li>
            </Link>
            <Link to='/home/friend-requests' className={this.state.selected === 'requests' ? "active" : "none"} onClick={() => this.sideNav('requests')}>
              <li className="center">
                <Badge badgeContent={this.props.userData.friendInvitation} color="secondary">
                  <img src={Invitation} alt="invitation" className="home-icon" />
                </Badge>
                <p className="home-sidenav">&emsp;Friend Requests</p>
              </li>
            </Link>
            <Link to='/home/my-friend' className={this.state.selected === 'myfriend' ? "active" : "none"} onClick={() => this.sideNav('myfriend')}>
              <li className="center">
                <img src={Myfriend} alt="myfriend" className="home-icon" />
                <p className="home-sidenav">&emsp;My Friend</p>
              </li>
            </Link>
          </ul>
          <Switch>
            <Route exact path='/home' render={(props) => (<DiscoverFriend {...props} props={this.props} />)} />
            <Route path='/home/friend-requests' render={(props) => (<FriendRequests {...props} props={this.props} />)} />
            <Route path='/home/my-friend' render={(props) => (<MyFriend {...props} props={this.props} />)} />
          </Switch>
        </div>
      </div>
    )
  }
}
class MyFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myfriend: [],
      goToChat: false,
      showCard: false,
      clickWhom: '',
    }
    this.myFriend = this.myFriend.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }
  componentDidMount() {
    const { userData } = this.props.props;
    if (userData.authUser) {
      this.myFriend();
    }
  }
  myFriend() {
    const { firebase, userData } = this.props.props;
    firebase.db.collection("Users").doc(userData.authUser.uid).collection("friends")
      .onSnapshot(
        (querySnapshot) => {
          let myfriend = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().status === "confirm") {
              console.log(doc.id, " => ", doc.data());
              myfriend.push(doc.data());
            }
          })
          this.setState({ myfriend });
        },
        (error) => {
          console.log(error)
        }
      )
  }
  handleSubmit(id) {
    const { firebase, userData } = this.props.props;
    // 找到聊天室
    // createRoomID(uid1, uid2)
    let roomID = createRoomID(id, userData.authUser.uid);
    console.log(roomID);
    firebase.db.collection("Room").doc(roomID)
      .update(
        {
          timestamp: Date.now()
        }
      );
    this.setState({ goToChat: true });
  }
  showCard(id) {
    console.log('personinfo', id);
    this.props.props.firebase.db.collection("Users").doc(id)
      .get()
      .then(
        (doc) => {
          console.log("Document data:", doc.data());
          this.setState({ clickWhom: doc.data(), showCard: !this.state.showCard });
        }
      )
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }
  closeCard() {
    this.setState({ showCard: !this.state.showCard })
  }
  render() {
    const { showCard, clickWhom } = this.state;
    console.log('myfriend', this.state);
    if (this.state.goToChat) {
      return <Redirect to="/message" />
    }
    return (
      <div className="view">
        <h3>Your Friends</h3>
        <div className="container">
          {this.state.myfriend.map(item => (
            <div className="friend-box" key={item.id}>
              <img className="avatar" src={item.avatar} alt="avatar" />
              <div className="friend-box-text">
                <h4>{item.name}</h4>
                <button className="see-more" onClick={this.showCard.bind(this, item.id)}>See more</button>
              </div>
            </div>
          ))}
        </div>
        {showCard ? (
          <div className="show-card">
            <div className="show-card-center">
              <img className="avatar" src={clickWhom.avatar} alt="avatar" />
              <p>
                <b>{clickWhom.username}</b>
              </p>
            </div>
            <p>
              <b>Intro</b>
            </p>
            <p>{clickWhom.bio}</p>
            <div className="container">
              <div className="container-1">
                <p>
                  <b>Gender&ensp;</b>
                  {clickWhom.gender}
                </p>
                <p>
                  <b>Age&ensp;</b>
                </p>
                <p>
                  <b>Star-Sign&ensp;</b>
                </p>
              </div>
              {/* <div className="line"></div> */}
              <div className="container-2">
                <p>
                  <b>Language&ensp;</b>
                  {clickWhom.language}
                  {/* {clickWhom.language.map(int => (<span key={int}>{int}&ensp;</span>))} */}
                </p>
                <p>
                  <b>Country&ensp;</b>
                  {clickWhom.country}
                </p>
                <p>
                  <b>Location&ensp;</b>
                  {clickWhom.location}
                </p>
              </div>
            </div>
            <p>
              <b>Last online&ensp;</b>
            </p>
            <div>
              <b>Interest&ensp;</b>
              <div className='interest-tag-wrapper'>
                {clickWhom.interest.map(int => (<span className='interest-tag-home' key={int}>{int}</span>))}
              </div>
            </div>
            <div className="container-button">
              <div className="go-back" onClick={this.closeCard}>
                <ArrowBackSharpIcon style={{ fontSize: 40 }} />
                Go Back
                  </div>
              <button onClick={this.handleSubmit.bind(this, clickWhom.id, clickWhom.username, clickWhom.avatar)}>Chat</button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

class FriendRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      confirmfriend: [],
      goToChat: false,
      showCard: false,
      clickWhom: '',
    }
    this.friendInvite = this.friendInvite.bind(this);
    this.confirmFriend = this.confirmFriend.bind(this);
    this.closeCard = this.closeCard.bind(this);
  }
  componentDidMount() {
    const { userData } = this.props.props;
    if (userData.authUser) {
      this.friendInvite();
    }
  }
  componentDidUpdate() {
    if (!this.state.isLoaded) {
      this.friendInvite();
      this.setState({ isLoaded: true });
    }
  }
  friendInvite() {
    const { firebase, userData } = this.props.props;
    firebase.db.collection("Users").doc(userData.authUser.uid).collection("friends")
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
    const { firebase, userData } = this.props.props;
    console.log(userData);
    // modify my list
    firebase.db.collection("Users").doc(userData.authUser.uid).collection("friends").doc(id)
      .update(
        {
          status: "confirm"
        }
      );
    // modify invited friend's list
    firebase.db.collection("Users").doc(id).collection("friends").doc(userData.authUser.uid)
      .update(
        {
          status: "confirm"
        }
      )
    // 建立聊天室
    // createRoomID(uid1, uid2)
    let roomID = createRoomID(id, userData.authUser.uid);
    console.log(roomID);
    let timestamp = Date.now();
    // 同時設定文件欄位又設定他的子集合兩件事並不衝突
    firebase.db.collection("Room").doc(roomID)
      .set(
        {
          uid: [userData.authUser.uid, id],
          user1: { uid: userData.authUser.uid, avatar: userData.userInfo.avatar, name: userData.userInfo.username },
          user2: { uid: id, avatar: avatar, name: name },
          timestamp: timestamp
        }
      )
      .then(
        // 這段是要設給已經收到邀請後 confirm to chat 的頁面
        firebase.db.collection("Room").doc(roomID).collection("message").doc()
          .set(
            {
              sender: "admin",
              content: "You both are friends now. Let's message your friend.",
              timestamp: timestamp
            }
          )
          .then(
            this.setState({ goToChat: true })
          )
      )
    // update context
    // this.setState({ goToChat: true, friendID: id });
    // () => {this.setState({ goToChat: true })};

  }
  showCard(id) {
    console.log('personinfo', id);
    this.props.props.firebase.db.collection("Users").doc(id)
      .get()
      .then(
        (doc) => {
          console.log("Document data:", doc.data());
          this.setState({ clickWhom: doc.data(), showCard: !this.state.showCard });
        }
      )
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }
  closeCard() {
    this.setState({ showCard: !this.state.showCard })
  }
  render() {
    console.log('confirmfriend', this.state.confirmfriend);
    console.log('clickWhom', this.state.clickWhom);
    console.log('confirmfriend', this.props);
    const { confirmfriend, showCard, clickWhom } = this.state;

    if (this.state.goToChat) {
      return <Redirect to="/message" />
    }
    if (!this.state.isLoaded) {
      return <div className="loading"><img src={Loading} alt="Loading" /></div>
    } else {
      return (
        <div className="view">
          <h3>Your Friend Requests</h3>
          <div className="container">
            {confirmfriend.map(item => (
              <div className="friend-box" key={item.id}>
                <img className="avatar" src={item.avatar} alt="avatar" />
                <div className="friend-box-text">
                  <h4>{item.name}</h4>
                  <button className="see-more" onClick={this.showCard.bind(this, item.id)}>See more</button>
                </div>
              </div>
            ))}
          </div>
          {showCard ? (
            <div className="show-card">
              <div className="show-card-center">
                <img className="avatar" src={clickWhom.avatar} alt="avatar" />
                <p>
                  <b>{clickWhom.username}</b>
                </p>
              </div>
              <p>
                <b>Intro</b>
              </p>
              <p>{clickWhom.bio}</p>
              <div className="container">
                <div className="container-1">
                  <p>
                    <b>Gender&ensp;</b>
                    {clickWhom.gender}
                  </p>
                  <p>
                    <b>Age&ensp;</b>
                  </p>
                  <p>
                    <b>Star-Sign&ensp;</b>
                  </p>
                </div>
                {/* <div className="line"></div> */}
                <div className="container-2">
                  <p>
                    <b>Language&ensp;</b>
                    {clickWhom.language}
                    {/* {clickWhom.language.map(int => (<span key={int}>{int}&ensp;</span>))} */}
                  </p>
                  <p>
                    <b>Country&ensp;</b>
                    {clickWhom.country}
                  </p>
                  <p>
                    <b>Location&ensp;</b>
                    {clickWhom.location}
                  </p>
                </div>
              </div>
              <p>
                <b>Last online&ensp;</b>
              </p>
              <div>
                <b>Interest&ensp;</b>
                <div className='interest-tag-wrapper'>
                  {clickWhom.interest.map(int => (<span className='interest-tag-home' key={int}>{int}</span>))}
                </div>
              </div>
              <div className="container-button">
                <div className="go-back" onClick={this.closeCard}>
                  <ArrowBackSharpIcon style={{ fontSize: 40 }} />
                  Go Back
                    </div>
                <button onClick={this.confirmFriend.bind(this, clickWhom.id, clickWhom.username, clickWhom.avatar)}>Confirm</button>
              </div>
            </div>
          ) : null}
        </div>
      )

    }
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

class DiscoverFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goToHome: false,
      error: null,
      isLoaded: false,
      isLoaded_friend: false,
      // myfriend: [],
      // friendlist: [],
      referlist: [],
      showCard: false,
      clickWhom: '',
      // interest: ''
    }
    this.addFriend = this.addFriend.bind(this);
    this.referFriends = this.referFriends.bind(this);
    this.closeCard = this.closeCard.bind(this);
    this.getInterest = this.getInterest.bind(this);
    this.filterFriend = this.filterFriend.bind(this);
  }
  // 拿 user id 取值，換 router 於此才會拿到更新 context 中的 user id
  componentDidMount() {
    const { userData, firebase } = this.props.props;
    const { isLoaded } = this.state;
    if (userData.authUser) {
      if (!isLoaded) {
        this.referFriends('', userData, firebase);
        this.setState({ isLoaded: true });
      }
    }
  }
  // 拿 user id 取值，重整畫面於此才會拿到更新 context 中的 user id
  componentDidUpdate() {
    const { userData, firebase } = this.props.props;
    const { isLoaded } = this.state;
    // 加個鎖不然會無限 loading
    if (!isLoaded) {
      this.referFriends('', userData, firebase);
      this.setState({ isLoaded: true });
    }
  }
  referFriends(interest, userData, firebase) {
    // 取得目前用戶列表
    if (interest === '') {
      firebase.db.collection("Users")
        .orderBy("timestamp", "desc")
        .limit(20)
        .get()
        .then(
          (querySnapshot) => {
            let friendlist = [];
            querySnapshot.forEach((doc) => {
              // if 有填資料再進來
              if (doc.data().avatar) {
                // cant see self as a friend
                if (doc.id !== userData.authUser.uid) {
                  console.log(doc.id, " => ", doc.data());
                  friendlist.push(doc.data().id);
                }
              }
            });
            this.filterFriend(firebase, userData.authUser.uid, friendlist)
          },
          (error) => {
            console.log(error)
          }
        )
    } else {
      firebase.db.collection("Users").where('interest', "array-contains", interest)
        // .orderBy("timestamp","desc")
        .limit(20)
        .get()
        .then(
          (querySnapshot) => {
            let friendlist = [];
            querySnapshot.forEach((doc) => {
              // if 有填資料再進來
              if (doc.data().avatar) {
                // cant see self as a friend
                if (doc.id !== userData.authUser.uid) {
                  console.log(doc.id, " => ", doc.data());
                  friendlist.push(doc.data().id);
                }
              }
            });
            this.filterFriend(firebase, userData.authUser.uid, friendlist)
          },
          (error) => {
            console.log(error)
          }
        )
    }
  }
  filterFriend(firebase, id, friendlist) {
    // 先取得我的朋友列表
    firebase.db.collection("Users").doc(id).collection("friends")
      .onSnapshot(
        (querySnapshot) => {
          let myfriend = [];
          querySnapshot.forEach((doc) => {
            console.log('myfriend', doc.id, " => ", doc.data());
            myfriend.push(doc.data().id);
          })
          console.log('myfriend', myfriend);
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
                    this.setState({ referlist, myfriend });
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
  }
  addFriend(id, name, avatar) {
    const { firebase, userData } = this.props.props;
    console.log(UserData);
    // modify my list
    firebase.db.collection("Users").doc(userData.authUser.uid).collection("friends").doc(id)
      .set(
        {
          id: id,
          name: name,
          avatar: avatar,
          status: "waitHisConfirm"
        }
      );
    // modify invited friend's list
    firebase.db.collection("Users").doc(id).collection("friends").doc(userData.authUser.uid)
      .set(
        {
          id: userData.authUser.uid,
          name: userData.userInfo.username,
          avatar: userData.userInfo.avatar,
          status: "askUrConfirm"
        }
      )
  }
  handleSubmit(id, name, avatar) {
    // console.log(id, name, avatar);
    this.addFriend(id, name, avatar);
    this.setState({ showCard: !this.state.showCard })
  }
  showCard(item) {
    // console.log('personinfo', item);
    this.setState({ clickWhom: item, showCard: !this.state.showCard });
  }
  closeCard() {
    this.setState({ showCard: !this.state.showCard })
  }
  getInterest(e) {
    const { userData, firebase } = this.props.props;
    this.referFriends(e.target.textContent, userData, firebase);
    // this.setState({ interest: e.target.textContent }, () => {
    //   console.log(this.state)
    // });
  }
  render() {
    const { showCard, clickWhom } = this.state;
    console.log('referfriend', this.props);
    console.log('home', this.state);
    const { error, isLoaded, referlist } = this.state;
    if (this.state.goToHome) {
      return <Redirect to="/" />
    }
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div className="loading"><img src={Loading} alt="Loading" /></div>
    } else {
      return (
        <div className="view">
          <h3>Discover new friends here!</h3>
          <Autocomplete
            value={this.state.interest}
            // name="location"
            onChange={this.getInterest}
            options={INTERESTS}
            //{INTERESTS}
            id="select-by-interest"
            autoComplete
            includeInputInList
            renderInput={params => <TextField {...params} label="Select by Interest" margin="normal" />}
          />
          <div className="container">
            {referlist.map(item => (
              <div key={item.id} className="friend-box">
                <img className="avatar" src={item.avatar} alt="avatar" />
                <div className="friend-box-text">
                  <p>
                    <b>{item.username}</b>
                  </p>
                  <p>{item.country},&nbsp;{item.language}</p>
                  <hr />
                  <div className="interest-box">
                    <p className="interest-ellipsis">
                      {/* <b>{item.interest}</b> */}
                      {item.interest.map(int => (<b key={int}>{int}&ensp;</b>))}
                    </p>
                  </div>
                  <button className="see-more" onClick={this.showCard.bind(this, item)}>See more</button>
                </div>
                {/* <div className="bottom-line"></div> */}
              </div>
            ))}
          </div>
          {showCard ? (
            <div className="show-card">
              <div className="show-card-center">
                <img className="avatar" src={clickWhom.avatar} alt="avatar" />
                <p>
                  <b>{clickWhom.username}</b>
                </p>
              </div>
              <p>
                <b>Intro</b>
              </p>
              <p>{clickWhom.bio}</p>
              <div className="container">
                <div className="container-1">
                  <p>
                    <b>Gender&ensp;</b>
                    {clickWhom.gender}
                  </p>
                  <p>
                    <b>Age&ensp;</b>
                  </p>
                  <p>
                    <b>Star-Sign&ensp;</b>
                  </p>
                </div>
                {/* <div className="line"></div> */}
                <div className="container-2">
                  <p>
                    <b>Language&ensp;</b>
                    {/* {clickWhom.language.map(int => (<b key={int}>{int}&ensp;</b>))} */}
                  </p>
                  <p>
                    <b>Country&ensp;</b>
                    {clickWhom.country}
                  </p>
                  <p>
                    <b>Location&ensp;</b>
                    {clickWhom.location}
                  </p>
                </div>
              </div>
              <p>
                <b>Last online&ensp;</b>
              </p>
              <div>
                <b>Interest&ensp;</b>
                <div className='interest-tag-wrapper'>
                  {clickWhom.interest.map(int => (<b key={int} className='interest-tag-home'>{int}</b>))}
                </div>
              </div>
              <div className="container-button">
                <div className="go-back" onClick={this.closeCard}>
                  <ArrowBackSharpIcon style={{ fontSize: 40 }} />
                  Go Back
                  </div>
                <button onClick={this.handleSubmit.bind(this, clickWhom.id, clickWhom.username, clickWhom.avatar)}>Add Friend</button>
              </div>
            </div>
          ) : null}
        </div>
      )
    }
  }
}

export default Home;
export { FriendRequests, MyFriend };