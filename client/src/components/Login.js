import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

let formData = {};

function Login() {
  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    formData = {
      name,
      roomNumber,
      isAdmin,
    };
  }, [name, roomNumber, isAdmin]);

  const isFormValid = name.trim() !== '' && roomNumber.trim() !== '';

  return (
    <div className='login'>
      <div className='login-user'>
        <div
          className={!isAdmin ? 'active' : ''}
          onClick={() => setIsAdmin(false)}
          id='user'
        >
          Join
        </div>
        <div
          className={isAdmin ? 'active' : ''}
          onClick={() => setIsAdmin(true)}
          id='admin'
        >
          Admin
        </div>
      </div>
      <div className='inputContainer'>
        <input
          type='text'
          placeholder='Enter Your Name'
          onChange={(e) => setName(e.target.value)}
          id='name'
          value={name}
        />
        <input
          type='text'
          placeholder={!isAdmin ? 'Enter Room Number' : 'Create Room Number'}
          onChange={(e) => setRoomNumber(e.target.value)}
          id='room'
          value={roomNumber}
        />
        <Link
          to={isAdmin ? '/admin' : '/user'}
          onClick={(e) => {
            if (!isFormValid) e.preventDefault();
          }}
        >
          <button disabled={!isFormValid}>
            {!isAdmin ? 'Join Room' : 'Create Room'}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
export { formData };
