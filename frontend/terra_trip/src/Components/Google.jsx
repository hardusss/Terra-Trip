import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


const GoogleLoginComponent = () => {
  const handleSuccess = (response) => {
    const userObject = jwtDecode(response.credential);

    const emailField = document.getElementById("email");
    const usernameField = document.getElementById("username");
    const email = userObject.email;
    const username = userObject.name;
    emailField.value = email;
    usernameField.value = username;
  };

  const handleFailure = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="258079348906-8l42ghp715pd9o02kjpn4k0m2cu8cnlq.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
