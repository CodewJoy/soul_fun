import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import './message.css';
import Logo from '../img/logo.svg';
import Navigation from '../App/navigation.js';
import Loading from '../img/loading.gif';

const Message = () => {
  return (
    <>
      <AuthUserContext.Consumer>
        {(UserData) => (
          <FirebaseContext.Consumer>
            {(firebase) => <MessageBase UserData={UserData} firebase={firebase} />}
          </FirebaseContext.Consumer>
        )}
      </AuthUserContext.Consumer>
    </>
  );
}

class MessageBase extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      isLoaded: false,
      talkToWhom: '',
      document: [],
      chat: [],
      // room: []
      value: '',
      message: []

    }
    this.loadRoom = this.loadRoom.bind(this);
    this.loadMessage = this.loadMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    const { firebase, UserData } = this.props;
    const { isLoaded } = this.state;
    if (UserData.authUser) {
      if (!isLoaded) {
        this.loadRoom(firebase, UserData, isLoaded);
        // this.loadMessage(firebase, UserData);
        this.setState({ isLoaded: true });
      }
    }
  }
  componentDidUpdate() {
    const { firebase, UserData } = this.props;
    const { isLoaded } = this.state;
    if (!isLoaded) {
      this.loadRoom(firebase, UserData);
      // this.loadMessage(firebase, UserData);
      this.setState({ isLoaded: true });
    }
  }
  loadRoom(firebase, UserData) {
    //let document = [];
    // firebase.db.collection("Room").doc().collection("message").doc()
    firebase.db.collection("Room").where("uid", "array-contains", `${UserData.authUser.uid}`)
      .onSnapshot(
        (querySnapshot) => {
          // console.log(doc.id, " => ", doc.data());
          // load chat room info
          let document = [];
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            if (doc.data().user1.uid !== UserData.authUser.uid) {
              document.push({
                roomDoc: doc.id,
                timestamp: doc.data().timestamp,
                friendInfo: doc.data().user1
              });
            } else if (doc.data().user2.uid !== UserData.authUser.uid) {
              document.push({
                roomDoc: doc.id,
                timestamp: doc.data().timestamp,
                friendInfo: doc.data().user2
              });
            }
          })
          // sort the chat room with timestamp
          document.sort(function (a, b) {
            return a.timestamp < b.timestamp ? 1 : -1;
          })
          console.log('document', document);
          // load message
          let loaded = 0;
          for (let i = 0; i < document.length; i++) {
            // 每個 message 都取最近的值
            // firebase.db.collection("Room").doc(document[i].roomDoc).collection("message").orderBy("timestamp")
            firebase.db.collection("Room").doc(document[i].roomDoc).collection("message").orderBy("timestamp", "desc").limit(1)
              .onSnapshot(
                (querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    document[i].friendInfo.chat = (doc.data());
                  })
                  loaded++;
                  // console.log("loaded", loaded);
                  if (loaded === document.length) {
                    console.log("document_peng", document);
                    this.loadMessage(document[0].friendInfo.uid, firebase, UserData)
                    this.setState({ document: document, talkToWhom: document[0].friendInfo.uid });
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
  loadMessage(frinendID, firebase, UserData) {
    // 需要兩個人的 uid 找到檔案名 再往下找 message 的檔案名稱
    console.log('dialogue', this.state.document);
    let roomID = createRoomID(UserData.authUser.uid, frinendID)
    firebase.db.collection("Room").doc(roomID).collection("message").orderBy("timestamp")
      .onSnapshot(
        (querySnapshot) => {
          let chat = [];
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            chat.push(doc.data());
          })
          this.setState({ chat });
        },
        (error) => {
          console.log(error)
        }
      )
  }
  clickRoom(frinendID) {
    const { firebase, UserData } = this.props;
    this.setState({ talkToWhom: frinendID });
    this.loadMessage(frinendID, firebase, UserData);
  }
  handleChange(event) {
    // this.setState({value: event.target.value});
    (() => this.setState({ value: event.target.value }))(console.log(this.state.value));
  }
  handleSubmit(event) {
    // console.log(this.state.value);
    // console.log('talktowhom', this.state.talkToWhom);
    event.preventDefault();
    const { firebase, UserData } = this.props;
    // 要有資料防護機制 在還沒 load 完之前不能按？
    // 需要兩個人的 uid 找到檔案名 再往下找 message 輸入
    console.log('input', this.state.document[0].friendInfo.uid);
    let roomID = createRoomID(UserData.authUser.uid, this.state.talkToWhom)
    // let roomID = createRoomID(UserData.authUser.uid, this.state.document[0].friendInfo.uid)
    firebase.db.collection("Room").doc(roomID).collection("message").doc()
      .set(
        {
          sender: UserData.userInfo.username,
          content: this.state.value,
          timestamp: Date.now()
        }
      )
    firebase.db.collection("Room").doc(roomID)
      .update(
        {
          timestamp: Date.now()
        }
      )
  }
  render() {
    // console.log("render", this.state.document);
    if (!this.state.isLoaded) {
      return <div className="loading"><img src={Loading} alt="Loading" /></div>
    } else {
      console.log("chat", this.state)
      console.log("chat", this.state.chat)
      // console.log("chat", this.props)
      // console.log('friendID', this.props.UserData.friendID)

      // state 更新後 document 有值再進來
      if (this.state.document.length > 0) {
        if (this.state.chat.length > 0) {
          return (
            <div className="message">
              <Navbar />
              <div className="main">
                <div className='chat-room'>
                  {this.state.document.map(item => (
                    <div className="chat-box" key={item.friendInfo.uid} onClick={this.clickRoom.bind(this, item.friendInfo.uid)}>
                      <img className="avatar" src={item.friendInfo.avatar} alt="avatar" />
                      <div className="container">
                        <h4 className="name">{item.friendInfo.name}</h4>
                        <p className="word">{item.friendInfo.chat.content ? item.friendInfo.chat.content : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="headerDivider"></div>

                <div className='conversation'>
                  <Conversation chat={this.state.chat} />
                  <div className="input-box">
                    <form onSubmit={this.handleSubmit}>
                      <input className='input-message' type="text" value={this.state.value} onChange={this.handleChange} />
                      <input className='input-click' type="submit" value="Enter" />
                    </form>
                  </div>
                </div>
                {/* <div className="headerDivider"></div>  */}
                {/* <ChatRoom friend={this.state.friend} /> */}

                {/* <friendProfile friendList={this.state.friendList}/> */}
              </div>
            </div>
          );
        } else {
          return <div className="loading"><img src={Loading} alt="Loading" /></div>
        }
      } else {
        return <div className="loading"><img src={Loading} alt="Loading" /></div>
      }
    }
  }
}
function createRoomID(uid1, uid2) {
  if (uid1 < uid2) {
    return uid1 + uid2;
  }
  else {
    return uid2 + uid1;
  }
}
// class ChatRoom extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     // console.log('chat', this.props.friend);
//     // const { friend } = ;
//     return (
//       <div className='chat-room'>
//         {/* {this.props.friend.map(item => (
//           <div className="chat-box" key={item.toString()+Date.now()}>
//             <h3>{item}</h3>
//           </div>
//         ))} */}
//       </div>
//     )
//   }
// }

class Conversation extends Component {
  render() {
    // console.log('conversation', this.props.chat);
    // console.log('conversation', this.props.chat[0].sender);
    return (
      <div className="talks">
        <div className="adm-dialog">
          <p>You both are friends now</p>
        </div>
        <div className="fri-dialog">
          <div>Hello</div>
        </div>
        <div className="fri-dialog">
          <div>Hello</div>
        </div>
        <div className="my-dialog">
          <div>在第5版中將地圖添加到ECMA-262標準中； 因此，它可能並不存在於該標準的所有實現中。 您可以通過在腳本的開頭插入以下代碼來解決此問題，從而允許在本身不支持它的實現中使用map。 假設Object</div>
        </div>

        {this.props.chat.map((item, index) => {
          console.log(item.sender);
          if (item.sender === "admin") {
            return (
              <div className="adm-dialog" key={index}>
                <p>{item.content}</p>
              </div>
            )
          } else if (item.sender === "Joy") {
            return (
              <div className="my-dialog" key={index}>
                <div>{item.content}</div>
              </div>
            )
          } else {
            return (
              <div className="fri-dialog" key={index}>
                <div>{item.content}</div>
              </div>
            )
          }
        }
        )}

        {/* {this.state.chat.map((item, index) => (
        <div className="dialog" key={index}>
          <p className="fri-dialog">{item.content}</p>
        </div>
      ))} */}
      </div>
    )
  }
}

// class friendProfile extends Component {
//   render() {
//     console.log(this.props)
//     const { friendList } = this.props
//     return (
//       <div className='pick-friend'>
//         <p>Talk to your friend</p>
//         <div className='pick-box'>
//           {/* <img className="avatar" src='https://firebasestorage.googleapis.com/v0/b/personal-project-b5b0e.appspot.com/o/002-male.svg?alt=media&token=e78987fe-00b1-4848-aee7-dc621352875d' alt="avatar" /> */}
//           <h4>name</h4>
//         </div>
//       </div>
//     )
//   }
// }

class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="logo">
          <img className="logo-img" src={Logo} alt="Logo" />
          <h3>SOULFUN</h3>
        </div>
        <Navigation />
      </div>
    )
  }
}


export default Message;