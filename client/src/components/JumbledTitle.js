import React from 'react';

const JumbledTitle = ({ title, time}) => {
  const jumbledStyle = {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#ff6347',
    margin: '20px 0',
  };

  const timerStyle={
    fontSize:'40px',
    width:'60px',
    height:'60px',
    borderRadius:'50%',
    backgroundColor:'#ff0000',
    margin:"0px auto",
  }
  return (
    <div>
      <h2>Guess the Fruits or Vegetables Name!</h2>
      {time>0 && <div style={timerStyle}>{time}</div>}
      <p style={jumbledStyle}>{title}</p>
    </div>
  );
};

export default JumbledTitle;