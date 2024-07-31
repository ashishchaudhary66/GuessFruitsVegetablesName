// Congratulation.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Congratulation.css';

const Congratulation = () => {
    const location = useLocation();
    const { topper } = location.state || {};
    const navigate = useNavigate();

    if (!topper) {
        navigate('/');
        return null;
    }

    return (
        <div className="congratulation-container">
            <h1>Congratulations, {topper.name}!</h1>
            <p>You are the top scorer with {topper.point} points!</p>
        </div>
    );
};

export default Congratulation;
