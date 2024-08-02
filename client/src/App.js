import React from 'react';
import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin from './components/pages/Admin';
import User from './components/pages/User';
import Congratulation from './components/pages/Congratulation';


function App() {
  const MAX_TIME=20;
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fun Friday Game: Unscramble the Fruits/Vegetables Name</h1>
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/admin' element={<Admin MAX_TIME={MAX_TIME} />} />
            <Route path='/user' element={<User MAX_TIME={MAX_TIME} />} />
            <Route path='/congratulation' element={<Congratulation/>} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
