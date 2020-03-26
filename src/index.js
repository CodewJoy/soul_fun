import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'; 

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

class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.storage = firebase.storage();
    }

    // *** Auth API ***
    doCreateUserWithEmailAndPassword(email, password) {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }
    doSignInWithEmailAndPassword(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    } 
    doSignOut() {
        return this.auth.signOut();
    }
    doPasswordReset(email) {
        return this.auth.sendPasswordResetEmail(email);
    }
    doPasswordUpdate(password) {
        return this.auth.currentUser.updatePassword(password);
    }
}

const FirebaseContext = React.createContext(null);

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App />
    </FirebaseContext.Provider>, document.querySelector("#root")
);

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);
export { FirebaseContext };
// export default Firebase;

// const FirebaseContext = React.createContext(null);
// ReactDOM.render(
//     <FirebaseContext.Provider value={new Firebase()}>
//          <FirebaseContext.Consumer>
//             {(firebase) => <App firebase={firebase} />}
//         </FirebaseContext.Consumer>
//     </FirebaseContext.Provider>, document.querySelector("#root")
// );

// export default Firebase;