import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import { createRoomID } from "./utils";
import './message.css';
import Navbar from '../Header';
import ChatRoom from './chat_room';
import Loading from '../img/loading.gif';
import SendMessage from '../img/send_message.svg';
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';

const Message = () => {
  return (
    <>
      <AuthUserContext.Consumer>
        {(userData) => (
          <FirebaseContext.Consumer>
            {(firebase) => <MessageBase userData={userData} firebase={firebase} />}
          </FirebaseContext.Consumer>
        )}
      </AuthUserContext.Consumer>
    </>
  );
}

class MessageBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      currentRoom: null,
      roomPool: [],
      chat: [],
      inputMessage: '',
      message: []
    }
    this.loadRoom = this.loadRoom.bind(this);
    this.loadMessage = this.loadMessage.bind(this);
    this.scrollToAnchor = this.scrollToAnchor.bind(this);
    this.backToRoom = this.backToRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    const { firebase, userData } = this.props;
    const { isLoaded } = this.state;
    if (userData.authUser) {
      if (!isLoaded) {
        this.loadRoom(firebase, userData);
      }
    }
  }
  componentDidUpdate() {
    const { firebase, userData } = this.props;
    const { isLoaded } = this.state;
    if (!isLoaded) {
      this.loadRoom(firebase, userData);
    }
  }
  componentWillUnmount() {
    for (let i = 0; i < this.unsubscribes.length; i++) {
      this.unsubscribes[i]();
    }
    this.unsubscribe2();
  }
  loadRoom(firebase, userData) {
    // firebase.db.collection("Room").doc().collection("message").doc()
    firebase.db.collection("Room").where("uid", "array-contains", `${userData.authUser.uid}`)
      .get()
      .then(
        // .onSnapshot(
        (querySnapshot) => {
          // load chat room info
          let roomPool = [];
          querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            if (doc.data().user1.uid !== userData.authUser.uid) {
              roomPool.push({
                roomDoc: doc.id,
                timestamp: doc.data().timestamp,
                friendInfo: doc.data().user1
              });
            } else if (doc.data().user2.uid !== userData.authUser.uid) {
              roomPool.push({
                roomDoc: doc.id,
                timestamp: doc.data().timestamp,
                friendInfo: doc.data().user2
              });
            }
          })
          // sort the chat room with timestamp
          roomPool.sort(function (a, b) {
            return a.timestamp < b.timestamp ? 1 : -1;
          })
          // load message
          let loaded = 0;
          // 監聽為陣列，unsubscribes也要做陣列，用 this 指向 component
          this.unsubscribes = [];
          for (let i = 0; i < roomPool.length; i++) {
            // 每個 message 都取最近的值
            this.unsubscribes[i] = firebase.db.collection("Room").doc(roomPool[i].roomDoc).collection("message").orderBy("timestamp", "desc").limit(1)
              .onSnapshot(
                (querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data());
                    roomPool[i].friendInfo.chat = (doc.data());
                  })
                  loaded++;
                  if (loaded === roomPool.length) {
                    // this.loadMessage(roomPool[0].friendInfo.uid, firebase, UserData)
                    this.setState({ roomPool: roomPool, isLoaded: true });
                    // this.setState({ roomPool: roomPool, currentRoom: roomPool[0].friendInfo.uid });
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
        }
      )
  }
  loadMessage(friendID, firebase, userData) {
    // 需要兩個人的 uid 找到檔案名 再往下找 message 的檔案名稱
    let roomID = createRoomID(userData.authUser.uid, friendID)
    if (roomID) {
      this.unsubscribe2 = firebase.db.collection("Room").doc(roomID).collection("message").orderBy("timestamp", "desc")
        .limit(100)
        .onSnapshot(
          (querySnapshot) => {
            let chat = [];
            querySnapshot.forEach((doc) => {
              // console.log(doc.id, " => ", doc.data());
              chat.push(doc.data());
            })
            this.setState({ chat });
          },
          (error) => {
            console.log(error)
          }
        )
    }
  }
  scrollToAnchor(propId) {
    // console.log(document.getElementById(propId));
    document.getElementById(propId).scrollIntoView();
  }
  backToRoom() {
    this.scrollToAnchor("root");
  }
  clickRoom(friendID, avatar, name) {
    const { firebase, userData } = this.props;
    this.setState({
      currentRoom:
      {
        friendID: friendID,
        avatar: avatar,
        name: name
      }
    });
    this.loadMessage(friendID, firebase, userData);
    this.scrollToAnchor("conversation");
  }
  handleChange(event) {
    let input = event.target.value;
    const { currentRoom } = this.state;

    this.setState(prevState => {
      if (!currentRoom) {
        return prevState;
      }
      return {
        inputMessage: {
          ...prevState.inputMessage,
          [currentRoom.friendID]: input
        }
      };
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    const { firebase, userData } = this.props;
    const { currentRoom, inputMessage } = this.state;
    // 要有資料防護機制 在還沒 load 完之前不能按
    // 需要兩個人的 uid 找到檔案名 再往下找 message 輸入
    if (!currentRoom || !inputMessage[currentRoom.friendID]) {
      return
    }
    let roomID = createRoomID(userData.authUser.uid, currentRoom.friendID)
    let time = Date.now();
    // let roomID = createRoomID(userData.authUser.uid, this.state.roomPool[0].friendInfo.uid)
    // send room's message > clean room's message > update room's timestamp
    if (roomID) {
      firebase.db.collection("Room").doc(roomID).collection("message").doc()
        .set(
          {
            sender: userData.userInfo.id,
            content: inputMessage[currentRoom.friendID],
            timestamp: time
          }
        )
        .then(
          () => {
            this.setState(prevState => {
              return {
                inputMessage: {
                  ...prevState.inputMessage,
                  [currentRoom.friendID]: ""
                }
              }
            },
              () => {
                firebase.db.collection("Room").doc(roomID)
                  .update(
                    {
                      timestamp: time
                    }
                  );
              }
            );
          }
        )
    }
  }
  render() {
    const { userData } = this.props;
    const { roomPool, currentRoom, inputMessage } = this.state;

    // state 更新後 roomPool 有值再進來
    if (roomPool.length > 0) {
      if (!this.state.isLoaded) {
        return <div className="loading"><img src={Loading} alt="Loading" /></div>
      } else {
        // console.log('test-memory-leak', currentRoom ? (inputMessage[currentRoom.friendID] ? (inputMessage[currentRoom.friendID]) : "") : "");
        // if (this.state.chat.length > 0) {
        return (
          <div className="message">
            <Navbar />
            <div className="main">
              <div className='chat-room'>
                <div className="my-chat center box-bottom">
                  {userData ?
                    (<div className="center">
                      <img className="avatar" alt="my-avatar" src={userData.userInfo.avatar} />
                      {/* <b>{this.props.userData.userInfo.username}</b> */}
                    </div>) : ""}
                  <h2>Chats</h2>
                </div>
                {roomPool.map(item => (
                  <div className="chat-box" key={item.friendInfo.uid} onClick={this.clickRoom.bind(this, item.friendInfo.uid, item.friendInfo.avatar, item.friendInfo.name)}>
                    <input type="radio" id={item.friendInfo.name} name="chatroom" value={item.friendInfo.name} />
                    <label htmlFor={item.friendInfo.name}>
                      <img className="avatar" src={item.friendInfo.avatar} alt="avatar" />
                      <div className="container">
                        <b className="name">{item.friendInfo.name}</b>
                        <br />
                        <span className="word">{item.friendInfo.chat.content ? item.friendInfo.chat.content : ""}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="headerDivider"></div>
              <div className='conversation' id='conversation'>
                {/* {this.state.currentRoom ? .name || ""} */}
                {currentRoom ?
                  (<div className="center box-bottom toolbar">
                    <div className="arrow-back">
                      &emsp;<ArrowBackSharpIcon style={{ fontSize: 40 }} onClick={this.backToRoom} />
                    </div>
                    <img className="avatar" alt="friend-avatar" src={currentRoom.avatar} />
                    <b>{currentRoom.name}</b>
                  </div>) : (
                    <div className="center box-bottom toolbar">
                      <div className="arrow-back">
                        &emsp;<ArrowBackSharpIcon style={{ fontSize: 40 }} onClick={this.backToRoom} />
                      </div>
                      <h3>&emsp;Click a room and start chatting</h3>
                    </div>
                  )}
                <ChatRoom chat={this.state.chat} currentRoom={currentRoom} />
                <div className="input-box" id="input-box" >
                  <form onSubmit={this.handleSubmit}>
                    <input className='input-message' type="text" placeholder={currentRoom ? ("Start chatting...") : ("Click a room and start chatting...")}
                      value={currentRoom ? (inputMessage[currentRoom.friendID] ? (inputMessage[currentRoom.friendID]) : "") : ""} onChange={this.handleChange} />
                    <input className='input-click' type="image" src={SendMessage} alt="Submit Form" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      }
    } else {
      return (
        <div className="message">
          <Navbar />
          <div className="main">
            <div className='chat-room'>
              <div className="my-chat center box-bottom">
                {userData ?
                  (<div className="center">
                    <img className="avatar" alt="my-avatar" src={userData.userInfo.avatar} />
                  </div>) : ""}
                <h2>Chats</h2>
              </div>
              <div className="chat-box">
                <label onClick={() => { this.scrollToAnchor("conversation") }}>
                  <div className="fake-avatar">
                  </div>
                  <div className="fake-container">
                  </div>
                </label>
                <label onClick={() => { this.scrollToAnchor("conversation") }}>
                  <div className="fake-avatar">
                  </div>
                  <div className="fake-container">
                  </div>
                </label>
              </div>
            </div>
            <div className="headerDivider"></div>
            <div className='conversation' id='conversation' >
              <div className="center box-bottom toolbar">
                <div className="arrow-back">
                  &emsp;<ArrowBackSharpIcon style={{ fontSize: 40 }} onClick={this.backToRoom} />
                </div>
                <h3>&emsp;Add a friend and start chatting</h3>
              </div>
              <div className="talks">
              </div>
              <div className="input-box">
                <form>
                  <input className='input-message' type="text" placeholder="Create a room and start chatting..." value={currentRoom ? (inputMessage[currentRoom.friendID] ? (inputMessage[currentRoom.friendID]) : "") : ""} onChange={this.handleChange} />
                  <input className='input-click' type="image" src={SendMessage} alt="Submit Form" />
                </form>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Message;