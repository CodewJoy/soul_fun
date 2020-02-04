/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';
import { Link, Redirect, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
// import { compose } from 'recompose';
// import { withFirebase } from '../../index.js';
import Close from '../img/close.svg';

const INITIAL_STATE = {
    username: '',
    email: '',
    pwd: '',
    error: null,
    signedUP: false
};

const SignUp = (props) => {
    return (
        <FirebaseContext.Consumer>
            {(firebase) => <SignUpForm {...props} firebase={firebase} />}
        </FirebaseContext.Consumer>
    )
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.usernameChange = this.usernameChange.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.pwdChange = this.pwdChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.changeToClose = this.changeToClose.bind(this);
    }

    usernameChange(event) {
        this.setState({ username: event.target.value })
    }

    emailChange(event) {
        this.setState({ email: event.target.value })
    }

    pwdChange(event) {
        this.setState({ pwd: event.target.value })
    }

    onSubmit(event) {
        const { username, email, pwd } = this.state;
        // const { firebase } = this.props;
        console.log(email);
        // console.log(username, email, pwd);
        // if (username === '') {
        //     alert("You haven't entered your username.");
        //     return
        // } else {
        //     if (email === '') {
        //         alert("You haven't entered your username.");
        //         return
        //     }
        // } 
        // if (username === '') {
        //     alert("You haven't entered your username.");
        //     return
        // } else if (email === '') {
        //     alert("You haven't entered your email.");
        // } else if (pwd === '') {
        //     alert("You haven't entered your password.");
        // }
        this.props.firebase.doCreateUserWithEmailAndPassword(email, pwd)
            .then((authUser) => {
                console.log(authUser);
                this.props.firebase.db.collection("Users").doc(`${authUser.user.uid}`).set({
                    username: username,
                    id: authUser.user.uid,
                    // name: DOM.name.value,
                    email: email,
                    pwd: pwd
                })
            })
            .then(() => {
                console.log('YA');
                this.setState({
                    signedUP:true
                });
                //this.props.history.push(ROUTES.ACCOUNT);
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    }

    changeToClose() {
        this.props.closeSignup(false);
        console.log(this.props);
    }

    render() {
        console.log("Test", this.state.signedUP);
        if(this.state.signedUP){
            return <Redirect to="/account" />;
        }
        const {
            username,
            email,
            pwd,
            error
        } = this.state;

        const isInvalid =
            pwd === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit} className="sign-up">
                <div className="line">
                    <h3>Sign up</h3>
                    <img className="close-button"  src={Close} alt="closebutton" 
                        onClick={this.changeToClose} 
                    />
                </div>
                <br />
                Username
                <br />
                <input className="key-in"
                    // name="username"
                    value={this.state.username}
                    onChange={this.usernameChange}
                    type="text"
                    placeholder="Full Name"
                />
                <br />
                Email
                <br />
                <input className="key-in"
                    // name="email"
                    value={this.state.email}
                    onChange={this.emailChange}
                    type="text"
                    placeholder="Email Address"
                />
                <br />
                Password
                <br />
                <input className="key-in"
                    // name="password"
                    value={this.state.pwd}
                    onChange={this.pwdChange}
                    type="password"
                    placeholder="Password"
                />
                <br />
                <div className="center-button">
                    <button disabled={isInvalid} type="submit">
                        SUBMIT
                    </button>
                </div>
                {/* <br />
                or
                <button>SIGN UP WITH FACEBOOK</button> */}

                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const SignUpLink = () => (
    <p>
        Don not have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = withRouter(SignUpFormBase);
// const SignUpForm = withRouter(SignUp);

export default SignUp;
export { SignUpForm, SignUpLink };