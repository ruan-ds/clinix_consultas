import React from 'react';
import Dashboard from './dashboard/dashboard';
import Appointment from './appointment/appointment';
import './content.css';

function Content() { 
    return ( 
        <div className="content">
            <Appointment />
        </div>
    )

}

export default Content;