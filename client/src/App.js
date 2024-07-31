import React from 'react';
import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin from './components/pages/Admin';
import User from './components/pages/User';
import Congratulation from './components/pages/Congratulation';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fun Friday Game: Unscramble the Fruits on Vegetables Name</h1>
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/admin' element={<Admin/>} />
            <Route path='/user' element={<User/>} />
            <Route path='/congratulation' element={<Congratulation/>} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;