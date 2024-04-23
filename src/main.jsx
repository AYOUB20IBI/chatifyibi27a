import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/signup/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Conversation from './components/conversation/Conversation.jsx';
import HomePage from './components/home/HomePage.jsx';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import PageError404 from './components/page404/PageError404';
import OurTeam from './components/more/OurTeam.jsx';
import Hero from './components/hero/Hero';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route  element={<HomePage />} >
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registre" element={< Signup/>} />
          <Route path="/about" element={< About/>} />
          <Route path="/contact" element={< Contact/>} />
          <Route path="/404" element={< PageError404/>} />
          <Route path="/ourteam" element={< OurTeam/>} />
          <Route path="*" element={<Login />} />
        </Route>
        <Route path="/chat" element={<Conversation />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer />
  </React.StrictMode>
);
