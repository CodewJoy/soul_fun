import React, { Component } from 'react';
import { FirebaseContext} from '../../index.js';
import { Redirect } from 'react-router-dom';

const SignOutButton = () => (
    <FirebaseContext.Consumer>
        {(firebase) => <SignOutButtonBase firebase={firebase} />}
    </FirebaseContext.Consumer>
);

class SignOutButtonBase extends Component {
    constructor(props) {
        super(props);
        // console.log(props);
        this.state = { signedOut: false };
        this.signOut = this.signOut.bind(this);
    }
    signOut() {
        // console.log(this.props);
        // console.log(this.props.firebase);
        this.props.firebase.doSignOut()
        .then(()=>{
            this.setState({
                signedOut:true
            })
        });
    }
    render() {
        // console.log("Test", this.state.signedOut);
        if(this.state.signedOut){
            return <Redirect to="/" />;
        }
        return (
            <div onClick={this.signOut}>
                Log Out
            </div>
        )
    }

}

export default SignOutButton;
// export default withFirebase(SignOutButton);