import React from 'react';
import Dashboard from './dashboard/dashboard';
import Appointment from './appointment/appointment';
import Doctors from './doctors/doctors';
import './content.css';

function Content() { 
    return ( 
        <div className="content">
            <Doctors />
        </div>
    )

}

export default Content;