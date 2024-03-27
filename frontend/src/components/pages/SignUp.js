import '../../App.css';
import './SignUp.css';
import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom'; // Import for login link navigation
import axios from 'axios';
import Footer from '../Footer';



const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include CSRF token in the request headers
        },
        body: JSON.stringify({ username, email, password }),
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


        console.log('Registration successful:'); // Handle success (e.g., redirect to login)

        // Clear form fields after successful registration (optional)
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/sign-in');
      } catch (error) {
        setErrorMessage(error.message); // Display error message to user
        console.log(error.message);
      }
    };

    return (
      <>
      <div className='sign-upo'>
      <div className='Register-form'>
        <h1>Register</h1>
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              minLength="4"
              maxLength="120"
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
          <button type="submit">Register</button>
          </div>
        </form>
        <p className='msg'>
          Already have an account? <Link to="/Sign-in">Log In</Link>
        </p>
      </div>
      </div>
      <Footer/>
      </>
    );
  };

export default RegisterForm;
