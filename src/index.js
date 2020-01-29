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
 
// Initialize firebase instance
firebase.initializeApp(firebaseConfig)
// Initialize Cloud Firestore through Firebase
let db = firebase.firestore()
console.log(db)

class App extends React.Component {
    constructor (props) {
        super(props)
        // this.state=store.getState()
        // this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit (event) {

    }

    render() {
        return (
            <div className="sing-up">
                <h3>Enter Email and Password</h3>
                Email<br />
                <input type="text" className="key-in"/>
                <br />
                Password<br />
                <input type="text" className="key-in"/>
                <br />
                <button onClick={this.handleSubmit}>SIGN UP</button>
                <br />
                or
                <button>SIGN UP WITH FACEBOOK</button>
            </div>
        )
    }
}
ReactDOM.render(<App/>, document.querySelector("#root"))