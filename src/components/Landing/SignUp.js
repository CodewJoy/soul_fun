/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';

const INITIAL_STATE = {
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
        this.emailChange = this.emailChange.bind(this);
        this.pwdChange = this.pwdChange.bind(this);
        this.singInSubmit = this.singInSubmit.bind(this);
    }
    emailChange(event) {
        this.setState({ email: event.target.value })
    }
        
    pwdChange(event) {
        this.setState({ pwd: event.target.value })
    }
        
    singInSubmit(event) {
        const { email, pwd } = this.state;
        // const { firebase } = this.props;
        console.log(email);
        this.props.firebase.doCreateUserWithEmailAndPassword(email, pwd)
          .then((response) => {
                console.log(response);
                this.props.firebase.db.collection("Users").doc().set({
                    id: response.user.uid,
                    // name: DOM.name.value,
                    email: email,
                    pwd: pwd
                })
            //return response;
          })
          .then(()=> {
            console.log('YA');
            this.setState({ ...INITIAL_STATE });
          })
          .catch(error => {
            this.setState({ error });
          });
        event.preventDefault();
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
export default SignUp;
export { SignUpForm };