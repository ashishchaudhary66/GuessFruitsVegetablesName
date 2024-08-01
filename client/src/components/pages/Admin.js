import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import JumbledTitle from '../JumbledTitle';
import Answer from '../Answer';
import { formData } from '../Login';
import { totalData, fruitsAndVegetables } from '../../FruitsAndVegetables';
import Leaderboard from '../Leaderboard';
import { useNavigate } from 'react-router-dom';

const ENDPOINT = "https://guess-fruits-vegetables-name.onrender.com";

function Admin({ MAX_TIME }) {
    const [current, setCurrent] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [time, setTime] = useState(MAX_TIME);
    const username = formData.name;
    const roomNumber = formData.roomNumber;
    const isAdmin = formData.isAdmin;
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);

    const resetTime = (newTime) => {
        setTime(newTime);
        if (socket) {
            socket.emit('time_counter', { time: newTime });
        }
    };

    const next = () => {
        setShowAnswer(false);
        const newCurrent = (current + 1) % totalData;
        setCurrent(newCurrent);
        resetTime(MAX_TIME);
        socket.emit('question', { ...fruitsAndVegetables[newCurrent], current: newCurrent, roomNumber });
    };

    const previous = () => {
        setShowAnswer(false);
        const newCurrent = ((current + totalData) - 1) % totalData;
        setCurrent(newCurrent);
        resetTime(MAX_TIME);
        socket.emit('question', { ...fruitsAndVegetables[newCurrent], current: newCurrent, roomNumber });
    };

    const startGame = () => {
        setGameStarted(true);
        resetTime(MAX_TIME);
        socket.emit('game-started', { gameStarted: true, roomNumber, current, ...fruitsAndVegetables[current] });
    };

    useEffect(() => {
        const newSocket = io(ENDPOINT, { transports: ['websocket'] });
        setSocket(newSocket);

        newSocket.emit('join_room', { username, roomNumber, isAdmin });

        newSocket.on('admin_exists', () => {
            navigate('/');
        });

        newSocket.on('game-topper', (data) => {
            navigate('/congratulation', { state: { topper: data.topper } });
        });

        return () => {
            newSocket.disconnect();
        };
    }, [username, roomNumber, isAdmin, navigate]);

    useEffect(() => {
        if (gameStarted && time > 0) {
            const timerId = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime - 1;
                    if (socket) {
                        socket.emit('time_counter', { time: newTime });
                    }
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [gameStarted, time, socket]);

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

    const welcomeStyle = {
        padding: '50px',
        backgroundColor: '#282c34',
        color: 'white',
        borderRadius: '10px',
        textAlign: 'center',
        margin: '50px auto',
        maxWidth: '600px',
        display: 'flex',
        justifyContent: 'space-between',
    };

    const headingStyle = {
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: '20px',
    };

    const paragraphStyle = {
        fontSize: '18px',
        marginBottom: '20px',
    };

    const AdminContainer = {
        margin: '0 auto',
        maxWidth: '1080px',
        display: 'flex',
        justifyContent: 'space-evenly',
    };

    const endGame = () => {
        socket.emit('game-ended');
    };

    return (
        <div>
            <h4>Room No: {roomNumber}</h4>
            <h2>Welcome {formData.name}</h2>
            {
                !gameStarted ? (
                    <div style={welcomeStyle}>
                        <div>
                            <h2 style={headingStyle}>Welcome to the Fun Friday Game!</h2>
                            <p style={paragraphStyle}>Unscramble the Fruits/Vegetables Name.</p>
                            <button style={buttonStyle} onClick={startGame}>Start Game</button>
                        </div>
                        {
                            socket !== null && <Leaderboard socket={socket} />
                        }
                    </div>
                ) : (
                    <div style={AdminContainer}>
                        <div>
                            <h3>{current + 1}/{totalData}</h3>
                            <JumbledTitle title={fruitsAndVegetables[current].jumbled} time={time} />
                            {showAnswer && <Answer answer={fruitsAndVegetables[current].original} />}
                            <button style={buttonStyle} onClick={previous}>Previous</button>
                            <button style={buttonStyle} onClick={() => setShowAnswer(!showAnswer)}>
                                {showAnswer ? "Hide Answer" : "Show Answer"}
                            </button>
                            <button style={buttonStyle} onClick={endGame}>End Game</button>
                            <button style={buttonStyle} onClick={next}>Next</button>
                        </div>
                        {
                            socket !== null && <Leaderboard socket={socket} />
                        }
                    </div>
                )
            }
        </div>
    );
}

export default Admin;
