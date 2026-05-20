import React from 'react';
import NavbarGeneral from '../../components/general/navbar/navbargeneral';
import Sidebar from '../../components/feed/sidebar/sidebar';
import Content from '../../components/feed/content/content';
import './feed.css'; 

function Feed() {
  return (
    <div className="feed-wrapper">
        <NavbarGeneral />
        
        {/* O container Flexbox engloba APENAS a Sidebar e o Conteúdo */}
        <div className="page-container">
            <Sidebar />
            <main className="main-content">
                <Content />
            </main>
        </div>
    </div>
  );
}

export default Feed;