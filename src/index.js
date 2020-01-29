import React from "react"
import ReactDOM from "react-dom"
import './style.css'

import { createStore, combineReducers, compose } from 'redux'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import { Provider } from 'react-redux'

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
 
const rfConfig = {} // optional redux-firestore Config Options
 
// Initialize firebase instance
firebase.initializeApp(firebaseConfig)
// Initialize Cloud Firestore through Firebase
let db = firebase.firestore()
console.log(db)
 
// Add reduxFirestore store enhancer to store creator
const createStoreWithFirebase = compose(
  reduxFirestore(firebase, rfConfig), // firebase instance as first argument, rfConfig as optional second
)(createStore)
 
// Add Firebase to reducers
// how to combine w redux reducer
const rootReducer = combineReducers({
  firestore: firestoreReducer
})
 
// Redux
// Create store with reducers and initial state
const initialState = {
    email: "your.email@example.com",
    password: "6 characters minimum"
}
const store = createStoreWithFirebase(rootReducer, initialState)
// how to combine reducer w rootReducer
let reducer = function(state, action){
    // 根據 action 的 type，來執行狀態更新的動作
    switch(action.type){
        case "SignUp":
            return { email:action.email, password:action.password }
        default:
            return state
    }
};
console.log(store)

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state=store.getState()
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit (event) {
        console.log(this.state)
        // 如果事件可以被取消，就取消事件（即取消事件的預設行為）。不會影響事件傳遞
        event.preventDefault()
        if (this.state.text.length === 0) {
          return
        }
        store.dispatch({
            type:"SignUp",
            email: this.state.email,
            password: this.state.password
        });
    }

    // 以下程式是用來連接 React 和 Redux
    // 回應狀態變化：Redux 處理完成，返回 React 接收最新狀態，並觸發畫面的更新
    refresh(){
        // 串接 Redux 的狀態改變，並且觸發 React 組件的更新
        this.setState(store.getState());
    }
    // 連結點建立：註冊狀態改變的通知處理函式，回應 Redux 中的狀態變化
    componentDidMount(){
        this.unsubscribe=store.subscribe(this.refresh.bind(this));
    }
    // 連結點斷開：若使用者介面被遺棄，則取消註冊函式
    componetWillUnmount(){
        this.unsubscribe();
    }

    render() {
        return (
            <Provider store={store}>
                <div className="sing-up">
                    <h3>Enter Email and Password</h3>
                    Email<br />
                    <input type="text" className="key-in" value={this.state.email} />
                    <br />
                    Password<br />
                    <input type="text" className="key-in" value={this.state.password} />
                    <br />
                    <button onClick={this.handleSubmit}>SIGN UP</button>
                    <br />
                    or
                    <button>SIGN UP WITH FACEBOOK</button>
                </div>
            </Provider>
        )
    }
}
ReactDOM.render(<App/>, document.querySelector("#root"))