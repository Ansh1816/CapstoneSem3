import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SubmitGem from './pages/SubmitGem';
import GemDetails from './pages/GemDetails';

import Explore from './pages/Explore';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/submit" element={<SubmitGem />} />
            <Route path="/gems/:id" element={<GemDetails />} />
            <Route path="/users/:id" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
