import React from 'react';

const Answer = ({ answer }) => {
  const answerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#32cd32',
    margin: '20px 0',
  };

  return (
    <div>
      <p style={answerStyle}>{answer}</p>
    </div>
  );
};

export default Answer;