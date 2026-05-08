import React from 'react';
import Content from './content/content';
import Sidebar from './sidebar/sidebar';
import './feed.css';

function Feed() { 
    return ( 
        <div className="feed-container">
            <Sidebar />
            <Content />
        </div>
    )

}

export default Feed;