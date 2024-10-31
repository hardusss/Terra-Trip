import React from 'react';
import '../styles/style.css'; 
import Hand from '../img/icons/waving-hand.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const api = 'http://127.0.0.1:8000';
  const sendData = async () => {
    const username  = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const error_alert = document.getElementById("error");

    error_alert.style.display = "none";
    error_alert.innerHTML = "";

    let isValid = true;
    if (username === "") {
      isValid = false;
      error_alert.style.display = "flex";
      error_alert.innerHTML = "Username is required";

    } else if (email === "") {
      isValid = false;
      error_alert.style.display = "flex";
      error_alert.innerHTML = "Email is required";

    } else if (password === "") {
      isValid = false;
      error_alert.style.display = "flex";
      error_alert.innerHTML = "Password is required";

    } 
    if (isValid) {
      try {
        const request = await fetch(`${api}/api/login/${username}/`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',  
          },
          body: JSON.stringify({
            "password": password,
            "email": email
          })
        });

        if (!request.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await request.json();
        
        if (data.error) {
          error_alert.style.display = "flex";
          error_alert.innerHTML = data.error;
        }
        if (data.login) {
          window.localStorage.setItem("id", data.id);
          window.localStorage.setItem("auth", true);
          navigate("/profile");
        }
        if (data.error === "User not found") {
          error_alert.style.display = "flex";
          error_alert.innerHTML = "User not found";
        }

      } catch (err) {
        console.error("An error occurred:", err);
        error_alert.style.display = "flex";
        error_alert.innerHTML = "An error occurred while logging in. Please try again.";
      } 
    } else if (username === "" && email === "" && password === "") {
      error_alert.style.display = "flex";
      error_alert.innerHTML = "All fields are required";
    }
  };

  return (
    <div className="sing_up">
      <div className='d-flex'>
        <h2>Welcome to Terra Trip</h2>
        <img src={Hand} alt="Waving hand" style={{ width: '30px', height: '30px' }} />
      </div>
      <form>
        <div className='fields'>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />

          <label htmlFor="email">Email</label>
          <input type="email" name="email"  id="email" />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <button type="button" className="btn btn-primary mt-4" onClick={sendData}>Login</button>
      </form>
    </div>
  );
};

export default Login;
