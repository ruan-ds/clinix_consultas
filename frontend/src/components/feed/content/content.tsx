import React from 'react';
import Dashboard from './dashboard/dashboard';
import Consultation from './consultation/consultation';
import './content.css';

function Content() { 
    return ( 
        <div className="content">
            <Consultation />
        </div>
    )

}

export default Content;