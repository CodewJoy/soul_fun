/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';
import { Redirect, withRouter } from 'react-router-dom';
// import { SignUpLink } from './SignUp';
import Close from '../img/close.svg';

// console.log(withFirebase);
const LogIn = (props) => {
    return (
        <FirebaseContext.Consumer>
            {(firebase) => <LogInForm {...props} firebase={firebase} />}
        </FirebaseContext.Consumer>
    )
};

const INITIAL_STATE = {
    email: 'test@gmail.com',
    pwd: '123456',
    error: null,
    logedIn: false
};

class LogInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.emailChange = this.emailChange.bind(this);
        this.pwdChange = this.pwdChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.changeToClose = this.changeToClose.bind(this);
    }

    emailChange(event) {
        this.setState({ email: event.target.value })
    }

    pwdChange(event) {
        this.setState({ pwd: event.target.value })
    }

    onSubmit(event) {
        const { email, pwd } = this.state;
        // const { firebase } = this.props;
        // console.log(email);
        this.props.firebase.doSignInWithEmailAndPassword(email, pwd)
            .then(() => {
                // console.log(this.props);
                this.setState({
                    logedIn: true
                });

                // this.props.history.push(ROUTES.ACCOUNT);
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    }

    changeToClose() {
        this.props.closeLogin(false);
    }

    render() {
        // console.log("Test", this.state.logedIn);
        if (this.state.logedIn) {
            return <Redirect to="/home" />;
        }
        const {
            email,
            pwd,
            error,
        } = this.state;

        const isInvalid =
            pwd === '' ||
            email === '';

        return (
            <form onSubmit={this.onSubmit} className="log-in">
                <div className="line">
                    <h3>Log In</h3>
                    <img className="close-button" src={Close} alt="closebutton"
                        onClick={this.changeToClose}
                    />
                </div>
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
                {/* <SignUpLink /> */}
            </form>
        )
    }
}
const LogInForm = withRouter(LogInFormBase);

export default LogIn;
export { LogInForm, LogInFormBase };