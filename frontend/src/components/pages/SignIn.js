import '../../App.css';
import './SignIn.css';
import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom'; // Import for login link navigation
import axios from 'axios';
import Footer from '../Footer';




const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  //function to fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/get_csrf_token');
      console.log(response);
      console.log(response.data.csrf_token);
      return response.data.csrf_token;
    } catch (error) {
      // Handle errors
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    try {
      // Fetch CSRF token from the server
      const csrfToken = await fetchCsrfToken();
      // Make registration request with CSRF token included in the headers
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include CSRF token in the request headers
        },
        body: JSON.stringify({ username, password }),
      });
  
      console.log(await response.text());
      if (!response.ok) {
        // Check for HTML content in the error response
        const contentType = response.headers.get('Content-Type');
        console.log(contentType)
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Unexpected HTML response from server. Please try again later.');
        } else {
          // Handle other potential errors based on status code
          throw new Error(`Registration failed with status ${response.status}`);
        }
      }
  
      console.log('login successful:'); // Handle success (e.g., redirect to login)
  
      // Clear form fields after successful registration (optional)
      setUsername('');
      setPassword('');
      setShowMessage(true); // Show welcome message
      setTimeout(() => {
        // Redirect to dashboard after 2 seconds
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message); // Display error message to user
      console.log(error.message);
    }
  };

    return (
      <>
      <div className='sign-in'>
      <div className="Login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength="4"
              maxLength="20"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8"
              maxLength="20"
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="btn-center">
          <button type="submit">Login</button>
          </div>
        </form>
        <p className='msg'>
          you don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </div>
      </div>
      {showMessage && <div className='sign-in-popup'>
      <p>Welcome to your dashboard. Here you can view and manage your data.</p></div>}
      <Footer/>
    </>
    );
  };

export default LoginForm;
