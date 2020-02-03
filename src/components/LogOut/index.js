import React, { Component } from 'react';
import { FirebaseContext, withFirebase } from '../../index.js';

const SignOutButton = () => (
    <FirebaseContext.Consumer>
        {(firebase) => <SignOutButtonBase firebase={firebase} />}
    </FirebaseContext.Consumer>
);

class SignOutButtonBase extends Component {
    constructor(props) {
        super(props);
    }
    signOut() {
        // console.log(this.props.firebase)
        // this.props.firebase.doSignOut()
        // .then((response) => {
        //     console.log(response);
        // })
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