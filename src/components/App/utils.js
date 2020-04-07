import React from 'react';
import Loading from '../img/loading.gif';
import LandingPage from '../Landing';

export function HOC(WrappedComponent, authUser) {
    if (authUser === "") {
        return (<div className="loading"><img src={Loading} alt="Loading" /></div>)
    } else if (authUser === null) {
        return (<LandingPage />)
    } else {
        return (<WrappedComponent />)
    }
}