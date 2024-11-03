// src/pages/Login.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Particles from "react-tsparticles"; // Import Particles
import { tsParticles } from "tsparticles-engine";



function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Dummy credentials
    const dummyUser = { username: 'admin', password: 'password' };

    if (username === dummyUser.username && password === dummyUser.password) {
      dispatch(login({ username })); // Log in with dummy user data
      navigate('/content-listing'); // Redirect to the Content Listing page after successful login
    } else {
      alert('Invalid credentials');
    }
  };

  

  return (
    <div className="login-page">
        <Particles
        id="tsparticles"
        options={{
          fpsLimit: 60,
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: {
              value: 0.5,
              random: true,
            },
            size: {
              value: 3,
              random: true,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              outMode: "bounce",
            },
          },
        }}
      />
      <div className="login-form">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>

  );
}

export default Login;
