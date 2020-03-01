import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import "babel-polyfill"
// import './edit.css';

const Edit = () => (
    <>
        <AuthUserContext.Consumer>
            {(UserData) => (
                <FirebaseContext.Consumer>
                    {(firebase) => <EditBase UserData={UserData} firebase={firebase} />}
                </FirebaseContext.Consumer>
            )}
        </AuthUserContext.Consumer>
    </>
);


class EditBase extends Component {
    // constructor(props) {
    //     super(props);
    // }
    // async componentDidMount() {
    //     console.log('yoyo', this.props);
    //     const querySnapshot = await this.props.firebase.db.collection("Room").orderBy("timestamp", "desc").get();
    //     let room = [];
    //     for (let i in querySnapshot.docs) {
    //         let doc = querySnapshot.docs[i];
    //         // console.log(doc.id, " => ", doc.data());
    //         room.push(doc.id);
    //     }
    //     console.log(room);
    //     for (let i = 0; i < room.length; i++) {
    //         console.log(room[i])
    //         let docRef = await this.props.firebase.db.collection("Room").doc(room[i]).collection("message").orderBy("timestamp", "desc").get();
    //         for (let i in docRef.docs) {
    //             let doc = docRef.docs[i];
    //             // console.log(doc.id, " => ", doc.data());
    //             console.log(doc.id, " => ", doc.data());
    //         }
    //         // if (docRef.exists) {
    //         //     // console.log("Document data:", docRef.data());
    //         //     console.log(docRef.id, " => ", docRef.data());
    //         // } else {
    //         //     // doc.data() will be undefined in this case
    //         //     console.log("No such document!");
    //         // }
    //     }

    // }
    test = () => {
        console.log("test=============")
    }
    render() {
        // const { confirmfriend } = this.state
        // const { isLoaded_friend, confirmfriend } = this.state
        // if (!isLoaded_friend) {
        //   return <div className="loading"><img src={Loading} alt="Loading" /></div>
        // } else {
        this.test();
        console.log(this.props);
        return (
            <h1>Edit</h1>
        );
    }
}

export default Edit;