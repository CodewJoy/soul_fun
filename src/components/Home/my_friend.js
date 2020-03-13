import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { createRoomID, getDistanceSpecifiedTime, getAge } from "./utils";
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';

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
        // console.log(roomID);
        if (roomID) {
            firebase.db.collection("Room").doc(roomID)
                .update(
                    {
                        timestamp: Date.now()
                    }
                );
            this.setState({ goToChat: true });
        }
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
                                    {getAge(clickWhom.birthday)}
                                </p>
                                <p>
                                    <b>Last online&ensp;</b>
                                    {getDistanceSpecifiedTime(clickWhom.timestamp)}
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
                        <div>
                            <b>Interest&ensp;</b>
                            <div className='interest-tag-wrapper'>
                                {clickWhom.interest.map(int => (<b className='interest-tag-home' key={int}>{int}</b>))}
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

export default MyFriend;