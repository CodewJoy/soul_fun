import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';

const SignUp = () => (
  <FirebaseContext.Consumer>
    {(firebase) => <SignUpForm firebase={firebase} />}
  </FirebaseContext.Consumer>
);

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', pwd: '', error: null };
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
        
    singInSubmit() {
        this.setState(state => ({
            email: state.email,
            pwd: state.pwd
        }));

        let firebase = this.props.firebase;
        console.log(firebase);
        // firebase.db.collection("Users").doc().set({
        //     email: this.state.email,
        //     pwd: this.state.pwd
        // });

        firebase.doCreateUserWithEmailAndPassword(this.state.email, this.state.pwd)
            .catch((error) => {
                this.setState({ error });
                return error;
            })
            .then((response) => {
                console.log(response);
                firebase.db.collection("Users").doc().set({
                    id: response.user.uid,
                    // name: DOM.name.value,
                    email: this.state.email,
                    pwd: this.state.pwd
                })
                return response;
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
export default SignUp;
export { SignUpForm };