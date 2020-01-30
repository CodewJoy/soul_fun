import React from "react"
import ReactDOM from "react-dom"
import './style.css'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgkvXmrD85tsW-f5l6XopAWZvsoqZpBUE",
    authDomain: "personal-project-b5b0e.firebaseapp.com",
    databaseURL: "https://personal-project-b5b0e.firebaseio.com",
    projectId: "personal-project-b5b0e",
    storageBucket: "personal-project-b5b0e.appspot.com",
    messagingSenderId: "764663149073",
    appId: "1:764663149073:web:101e7fa123fa33e5be37b0",
    measurementId: "G-FSKZFHKBND"
}
 
// // Initialize firebase instance
// firebase.initializeApp(firebaseConfig)
// // Initialize Cloud Firestore through Firebase
// let db = firebase.firestore()
class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.database();
    }
    doCreateUserWithEmailAndPassword (email, password) {
        this.auth.createUserWithEmailAndPassword(email, password);
    }

    doSignInWithEmailAndPassword (email, password) {
        this.auth.signInWithEmailAndPassword(email, password);
    } 
    // doSignOut = () => this.auth.signOut();
    
    // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    
    // doPasswordUpdate = password =>
    // this.auth.currentUser.updatePassword(password);
}
console.log(Firebase)

const FirebaseContext = React.createContext(null);
console.log(FirebaseContext)

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = { email: '', pwd: '' }
        this.emailChange = this.emailChange.bind(this)
        this.pwdChange = this.pwdChange.bind(this)
        this.singInSubmit = this.singInSubmit.bind(this)
    }

    emailChange (event) {
        this.setState({ email: event.target.value })
    }

    pwdChange (event) {
        this.setState({ pwd: event.target.value })
    }

    singInSubmit (event) {
        // static contextType = FirebaseContext
        let db = this.context
        console.log(this.state.email)
        console.log(this.state.pwd)
        // // 如果事件可以被取消，就取消事件（即取消事件的預設行為）。不會影響事件傳遞
        // event.preventDefault()
        // if (this.state.email.length === 0) {
        //   return
        // } else {
        //     if (this.state.pwd.length === 0) {
        //         return
        //     }
        // }
        this.setState(state => ({
          email: state.email,
          pwd: state.pwd
        }))
        db.collection("Users").doc().set({
            email: this.state.email,
            pwd: this.state.pwd
        })
    }

    render() {
        return (
            <div className="sing-up">
                <h3>Enter Email and Password</h3>
                Email<br />
                <input type="text" className="key-in" 
                    value={this.state.email}
                    onChange = {this.emailChange} 
                />
                <br />
                Password<br />
                <input type="text" className="key-in"
                    value={this.state.pwd}
                    onChange = {this.pwdChange} 
                />
                <br />
                <button onClick={this.singInSubmit}>SIGN UP</button>
                <br />
                or
                <button>SIGN UP WITH FACEBOOK</button>
            </div>
        )
    }
}
ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App />
    </FirebaseContext.Provider>, document.querySelector("#root"))