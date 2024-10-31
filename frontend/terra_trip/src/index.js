import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import GoogleLoginComponent from "./Components/Google";
import Profile from "./Components/Profile";
import Dicoration from './Components/Dicoration';
import EditProfile from "./Components/EditProfile";
import Search from './Components/Search';
import UserProfile from './Components/UsersProfiles';
import NavigateBar from './Components/Navigate';
import CreatePost from './Components/CreatePost';
import Home from './Components/Home';
import Post from './Components/Post';

const setCountry = () => {
  window.localStorage.setItem("country", "Ukraine");
};

const App = () => {
  setCountry();
  const [showLogin, setShowLogin] = useState(false);
  const navigator =  useNavigate();
  const toggleComponent = () => {
    setShowLogin(prevState => !prevState);
  };
  useEffect(() => {
    if (window.localStorage.getItem("auth")) {
      navigator("/profile");
    }
  }, [navigator]);
  return (
    <div>
      <Dicoration />
      <div className='form_user'>
        {showLogin ? <Login /> : <SignUp />}
        <p onClick={toggleComponent} style={{color: "blue", cursor: "pointer", "text-align": "center", "margin-left": "-40px"}} className='mt-3'>
          {showLogin ? 'Don\'t have account? Go to Sign Up' : 'Have account? Go to Login'}
        </p>
        <div className='mt-1' style={{"width": "300px"}}><GoogleLoginComponent /></div>
        <div className="alert alert-danger mt-3" role="alert" id='error' style={{"display": "none", "width": "90%"}}></div>
      </div>
    </div>
  );
};

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} /> 
      <Route path="/profile" element={<div className='d-md-flex'><NavigateBar /><Profile /> </div>} />
      <Route path="/profile/edit" element={<div className='d-md-flex'><NavigateBar /><EditProfile /> </div>} />
      <Route path="/search" element={<div className='d-md-flex'><NavigateBar /><Search /> </div>} />
      <Route path='/user/:id' element={<div className='d-md-flex'><NavigateBar /><UserProfile /> </div>}/>
      <Route path='/post/create' element={<div className='d-md-flex'><NavigateBar /><CreatePost /> </div>}/>
      <Route path='/home' element={<div className='d-md-flex'><NavigateBar /><Home /> </div>}/>
      <Route path='/post/:id' element={<div className='d-md-flex'><NavigateBar /><Post /> </div>}/>
    </Routes>
  </Router>,
  document.getElementById("app")
);
