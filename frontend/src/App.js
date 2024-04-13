
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import RegisterForm from './components/pages/SignUp';
import LoginForm from './components/pages/SignIn';
import Dashboard from './components/pages/Dashboard';
import { AuthProvider } from './components/AuthContext';


function App() {
  return (
    <>
      <Router>
        <AuthProvider>
        <Navbar />
        <Routes>
          <Route path='/' exact Component={Home} />
          <Route path='/sign-up' element={<RegisterForm />} />
          <Route path='/sign-in' element={<LoginForm />} />
          <Route path='/dashboard' exact Component={Dashboard} />
        </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
