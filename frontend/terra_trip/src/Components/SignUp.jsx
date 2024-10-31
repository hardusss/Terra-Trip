import React from 'react';
import Country from "./Country";
import '../styles/style.css'; 
import Hand from '../img/icons/waving-hand.png';
import { useNavigate } from 'react-router-dom';


function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return pattern.test(email);
}


const SignUp = () => {
  const navigate = useNavigate(); 
  const api = 'http://127.0.0.1:8000';
  const sendData = async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const email = document.getElementById("email").value.trim();
    const country = window.localStorage.getItem("country").trim();
    const error_alert = document.getElementById("error");
    
  
    error_alert.style.display = "none";
    error_alert.innerHTML = "";
  
    let isValid = true;
    if (isValidEmail(email)){
  
    } else {
      isValid = false;
      error_alert.style.display = "flex";
      error_alert.innerHTML = "Email is not valid";
    }
    if (username === "") {
      isValid = false;
      error_alert.style.display = "flex";
      error_alert.innerHTML = "Username is required";
    } else if (email === "") {
      isValid = false;
      error_alert.style.display = "flex";
      error_alert.innerHTML = "Email is required";
    }  else if (password === "") {
      isValid = false;
      error_alert.style.display = "flex";
      error_alert.innerHTML = "Password is required";
    } else if (country === "") {
      isValid = false;
      error_alert.style.display = "flex";
      error_alert.innerHTML = "Country is required";
    }
  
    if (isValid) {
      try {
        const prom = await fetch(`${api}/api/create/`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({
            "username": username,
            "password": password,
            "country": country,
            "user_email": email, 
          }),
        });
  
        const data = await prom.json();
  
  
        if (data.error) {
          error_alert.style.display = "flex";
          error_alert.innerHTML = "User already exists";
        } else {
          navigate("/profile")
          window.localStorage.setItem("id", data.user_id);
          window.localStorage.setItem("auth", true);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else if (username === "" && password === "" && email === "" && country === "") {
      error_alert.style.display = "flex";
      error_alert.innerHTML = "All fields are required";
    }
  };
    return (
      <div className="sing_up">
        <div className='d-flex'>
          <h2>Welcome to Terra Trip</h2>
          <img src={Hand} style={{ width: '30px', height: '30px' }} alt="Waving Hand" />
        </div>
        <form>
          <div className='fields'>
            <label htmlFor="username">Username</label>
            <input type="text" name="username"  id='username' />
  
  
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id='email'/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id='password' />
          </div>
          <br />
          <p>Country: </p>
          <Country /> 
          <button className="btn btn-primary" id='send' type="button" onClick={sendData}>Register</button>
        </form>

        
      </div>
    );
  }


export default SignUp;
