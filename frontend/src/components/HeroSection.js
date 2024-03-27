import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';
import { Link } from 'react-router-dom'; // Import for login link navigation


function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='/videos/video-2.mp4' autoPlay loop muted />
      <h1>WATCHTRACKER</h1>
      <p>Track shows and movies you watch</p>
      <p>What are you waiting for?</p>
      <div className='hero-btns'>
        
        <Link to="/sign-up"><Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          Start Tracking
        </Button></Link>
        {/* <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          SIGN UP <i className='far fa-play-circle' />
        </Button> */}
      </div>
    </div>
  );
}

export default HeroSection;
