import React from 'react';
import './dashboard.css';
import Card from './card/card';

function Dashboard() {
    return (
        <div>
            <div className="container">
                <header>
                    <h1>Bem-vindo de volta, Gabriel!</h1>
                    <p>Sua saúde em dia.</p>
                </header>
            </div>

            <div>
                <Card />
            </div>
        </div>
    )
}
export default Dashboard;