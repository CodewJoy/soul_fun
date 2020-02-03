/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';
import { Link, Redirect, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import { withFirebase } from '../../index.js';
import { SignUpLink } from './SignUp';

// console.log(withFirebase);

const INITIAL_STATE = {
    email: '',
    pwd: '',
    error: null,
};

const LogIn = () => (
    // <div>
    //     <h1>SignUp</h1>
    //     <SignUpForm />
    // </div>
    <FirebaseContext.Consumer>
        {(firebase) => <LogInForm firebase={firebase} />}
    </FirebaseContext.Consumer>
);

class LogInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.emailChange = this.emailChange.bind(this);
        this.pwdChange = this.pwdChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
        console.log(email);
        this.props.firebase.doSignInWithEmailAndPassword(email, pwd)
            .then(() => {
                console.log('YA');
                this.setState({
                    logedIn:true
                });
                // this.props.history.push(ROUTES.ACCOUNT);
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    }

    render() {
        console.log("Test", this.state.logedIn);
        if(this.state.logedIn){
            return <Redirect to="/account" />;
        }
        const {
            email,
            pwd,
            // error,
        } = this.state;

        const isInvalid =
            pwd === '' ||
            email === '';

        return (
            <form onSubmit={this.onSubmit} className="log-in">
                <h3>Log In</h3>
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

                {/* {error && <p>{error.message}</p>} */}
                <SignUpLink />
            </form>
        )
    }
}

const LogInForm = withRouter(LogInFormBase);

export default LogIn;
export { LogInForm };