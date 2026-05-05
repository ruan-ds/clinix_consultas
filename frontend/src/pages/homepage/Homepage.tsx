import React from 'react';
import './Homepage.css';
import Navbar from '../../components/homepage/navbar/navbar';
import Banner from '../../components/homepage/banner/banner';
import Stats from '../../components/homepage/stats/stats';
import Benefits from '../../components/homepage/benefits/benefits';
import Cta from '../../components/homepage/cta/cta';
import Footer from '../../components/homepage/footer/footer';
function Homepage() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        <Banner />
        <Stats />
        <Benefits />
        <Cta />
        <Footer />
      </main>
    </div>
  );
}

export default Homepage;
