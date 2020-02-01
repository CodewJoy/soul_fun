/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import { withFirebase } from '../../index.js';

const INITIAL_STATE = {
    username: '',
    email: '',
    pwd: '',
    error: null,
}; 

const SignUp = () => (
  <FirebaseContext.Consumer>
    {(firebase) => <SignUpForm firebase={firebase} />}
  </FirebaseContext.Consumer>
);

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.usernameChange = this.usernameChange.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.pwdChange = this.pwdChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
          .then(()=> {
            console.log('YA');
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.ACCOUNT);
          })
          .catch(error => {
            this.setState({ error });
          });
        event.preventDefault();
    }

    render() {
        const {
            username,
            email,
            pwd,
            // error,
        } = this.state;

        const isInvalid =
        pwd === '' ||
        email === '' ||
        username === '';

        return (
            <form onSubmit = {this.onSubmit} className="sing-up">
                <h3>Sign up</h3>
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
                <button disabled={isInvalid} type="submit">
                    SIGN UP
                </button>
                {/* <br />
                or
                <button>SIGN UP WITH FACEBOOK</button> */}

                {/* {error && <p>{error.message}</p>} */}
            </form>
        )
    }
}

const SignUpLink = () => (
    <p>
        Don not have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

// const SignUpFormRouter = compose(
//     withRouter,
//     withFirebase,
//   )(SignUpForm);

export default SignUp;
export { SignUpForm, SignUpLink  };