// Congratulation.js

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import sound from '../../audio//dance.mp3'
import Confetti from 'react-confetti';
import "./Congratulation.css";

const Congratulation = () => {
  const location = useLocation();
  const { topper } = location.state || {};
  const navigate = useNavigate();
  const congratsAudio=new Audio(sound);
  const buttonStyle = {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#61dafb',
    color: '#282c34'
};

  if (!topper) {
    navigate("/");
    return null;
    congratsAudio.play();
  }

  return (
    <>
      <Confetti />
      <div className="congratulation-container">
        <h1>Congratulations, {topper.name}!</h1>
        <p>You are the top scorer with {topper.point} points!</p>
        <button style={buttonStyle} onClick={()=>navigate("/")}>Go to Home Page</button>
      </div>
    </>
  );
};

export default Congratulation;
