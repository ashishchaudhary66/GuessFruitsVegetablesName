import React, { useEffect, useState } from 'react';
import { totalData } from '../../FruitsAndVegetables';
import { formData } from '../Login';
import JumbledTitle from '../JumbledTitle';
import Answer from '../Answer';
import './User.css';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useNavigate } from 'react-router-dom';

const ENDPOINT = "https://guess-fruits-vegetables-name.onrender.com";
let socket;

function User({MAX_TIME}) {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentNum, setCurrentNum] = useState(0);
    const [question, setQuestion] = useState();
    const [answer, setAnswer] = useState();
    const [responses, setResponses] = useState([]);
    const [currentText, setCurrentText] = useState("");
    const [increase, setIncrease] = useState(0);
    const [time, setTime] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);

    const navigate = useNavigate();
    const username = formData.name;
    const roomNumber = formData.roomNumber;
    const isAdmin = formData.isAdmin;
    const MAX_POINT = 100;

    useEffect(() => {
        socket = io(ENDPOINT, { transports: ['websocket'] });
        socket.emit('join_room', { username, roomNumber, isAdmin });

        socket.on('received_question', (data) => {
            setQuestion(data.jumbled);
            setCurrentNum(data.current);
            setGameStarted(true);
            setAnswer(data.original);
            setIncrease(0);
            setIsCorrect(false);
        });

        socket.on('get_time', (data) => {
            setTime(data.time);
        });

        socket.on('game-topper', (data) => {
            navigate('/congratulation', { state: { topper: data.topper } });
        });

        return () => {
            socket.off('received_question');
            socket.off('get_time');
            socket.off('game-topper');
            socket.disconnect();
            setTotalPoints(0);
        };
    }, [username, roomNumber, isAdmin, navigate]);

    const submitHandler = () => {
        if (currentText === '') {
            return;
        }
        setCurrentText('');
        const text = currentText.trim();
        setIsCorrect(false);
        if (text.toLowerCase() === answer.toLowerCase() && increase === 0) {
            const increment = Math.ceil((MAX_POINT * time / MAX_TIME) + MAX_POINT);
            setIncrease(increment);
            const message1 = { text: text, isCorrect: true };
            const message2 = { text: `Correct +${increment}`, isCorrect: true };
            socket.emit('update-point', { increase: increment });
            setTotalPoints(totalPoints + increment);
            setResponses((prevResponses) => [...prevResponses, message1, message2]);
            setIsCorrect(true);
            return;
        }
        const message = { text: text, isCorrect: false };
        setResponses((prevResponses) => [...prevResponses, message]);
    };

    const welcomeStyle = {
        padding: '50px',
        backgroundColor: '#282c34',
        color: 'white',
        borderRadius: '10px',
        textAlign: 'center',
        margin: '50px auto',
        maxWidth: '600px',
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

    return (
        <div>
            <h2>Welcome {formData.name} </h2>
            {
                !gameStarted ? (
                    <div style={welcomeStyle}>  
                        <div>
                            <h4>Room No : {roomNumber}</h4>
                            <h2 style={headingStyle}>Welcome to the Fun Friday Game!</h2>
                            <p style={paragraphStyle}>Unscramble the Fruits/Vegetables Name.</p>
                        </div>
                    </div>
                ) : (
                    <div className='user'>
                        <div className='quesContainter'>
                            <h3>{currentNum + 1}/{totalData}</h3>
                            <JumbledTitle title={question} time={time} />
                            {time === 0 && <Answer answer={answer} />}
                        </div>
                        <div className='chatContainer'>
                            <h3>Total Score: {totalPoints}</h3>
                            <ScrollToBottom className='response'>
                                {responses.map((response, index) => (
                                    <div className={response.isCorrect ? 'text-right' : 'text-left'} key={index}>
                                        <p className={`responseText ${response.isCorrect && 'correct'}`}>{response.text}</p>
                                    </div>
                                ))}
                            </ScrollToBottom>
                            <div>
                                <input
                                    onKeyDown={(event) => event.key === 'Enter' ? submitHandler() : null}
                                    type='text'
                                    placeholder='Write your answer'
                                    id='answerInput'
                                    onChange={(e) => setCurrentText(e.target.value)}
                                    disabled={time === 0 || isCorrect}
                                    value={currentText}
                                    required
                                />
                                <button onClick={submitHandler} className='sendBtn' disabled={time === 0 || isCorrect}>Send</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default User;
