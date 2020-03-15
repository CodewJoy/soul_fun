import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../img/404.svg';

const NotFound = () => (
    <div>
        <img className='not-found' src={PageNotFound} style={{ width: 300, height: 300, display: 'block', margin: 'auto', position: 'relative'}} />
        <center>
            <Link to="/">
                <h1>Return to Home Page</h1>
            </Link>
        </center>
    </div>
);
export default NotFound;