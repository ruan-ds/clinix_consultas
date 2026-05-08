import React from 'react';
import Navbargeneral from '../../components/general/navbar/navbargeneral'
import Sidebar from '../../components/feed/sidebar/sidebar';
import Content from '../../components/feed/content/content';
function Feed() {
  return (
    <div>
        <Navbargeneral />
        <Sidebar />
        <Content />
    </div>
  );
}

export default Feed;