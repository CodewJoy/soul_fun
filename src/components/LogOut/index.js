import React, { Component } from 'react';
import { FirebaseContext} from '../../index.js';

const SignOutButton = () => (
    <FirebaseContext.Consumer>
        {(firebase) => <SignOutButtonBase firebase={firebase} />}
    </FirebaseContext.Consumer>
);

class SignOutButtonBase extends Component {
    constructor(props) {
        super(props);
        // console.log(props);
        this.signOut = this.signOut.bind(this);
    }
    signOut() {
        // console.log(this.props);
        // console.log(this.props.firebase);
        this.props.firebase.doSignOut();
    }
    render() {
        return (
            <button type="button" onClick={this.signOut}>
                Log Out
            </button>
        )
    }

}

export default SignOutButton;
// export default withFirebase(SignOutButton);