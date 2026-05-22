import React from 'react';
import Dashboard from './dashboard/dashboard';
import Appointment from './appointment/appointment';
import Doctors from './doctors/doctors';
import Configs from './configs/configs';
import './content.css';

function Content() { 
    return ( 
        <div className="content">
            <Configs />
        </div>
    )

}

export default Content;