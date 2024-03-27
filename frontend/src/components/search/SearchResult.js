import React, { useState } from 'react';
import './SearchResult.css'; // Import your CSS file for styling
import ReactDOM from 'react-dom';
// import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import axios from 'axios'
//import fetchCsrfToken from '../pages/SignIn';

export const SearchResult = ({ result }) => {
  const [showPopup, setShowPopup] = useState(false);
  console.log(result);

  const handlePopupClose = () => {
    setShowPopup(!showPopup);
  };

  const handleResultClick = () => {
    setShowPopup(!showPopup); // Trigger popup on result click
  };

  return (
    <div className="search-result" onClick={handleResultClick}>
      {result.name}
      {showPopup && (
        ReactDOM.createPortal(
          <Popups onClose={handlePopupClose} result={result} />,
          document.body
        )
      )}
    </div>
  );



  
};
const fetchCsrfToken = async () => {
  try {
    const response = await axios.get('/get_csrf_token');
    console.log(response);
    console.log(response.data.csrf_token);
    return response.data.csrf_token;
  } catch (error) {
    // Handle errors
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
};
const handleAddToWatchlist = async (result) => {
  try {
    const csrfToken = await fetchCsrfToken(); // Assuming this fetches the token
    const response = await axios.post(`/api/watchlist/add/${result.id}`, {tmdb_data: result}, {
      headers: {
          'X-CSRFToken': csrfToken
      }
    });
    console.log('tes1')
    console.log(response.data); // Log the response for debugging (optional)
    // Optionally show a success message to the user
  } catch (error) {
    console.error(error); // Handle potential errors during the request
    // Optionally show an error message to the user
  }
};

// the popup
const Popups = ({ children, onClose, result,handlePopupClose }) => {
  return (
    <>
      <div className="popup-backdrop" onClick={handlePopupClose} />
      <div className="popup">
        {children}
        <div className='show-info-container'>
        <div className='shop-poster'>
          {/* Image */}
          {result.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${result.poster_path}`}
              alt={result.name}
            />
          )}
        </div>
        <div className='show-info'>
          <h2>{result.name}</h2>
      <p>Media Type: {result.media_type}</p>

      {/* Release Details (if applicable) */}
      {result.media_type === 'tv' && (
        <p>First Air Date: {result.first_air_date}</p>
      )}

      {/* Overview */}
      <p>Overview</p>
      <p>{result.overview}</p>

      {/* Additional Details (optional) */}
      
        <ul>
          <li>Popularity: {result.popularity}</li>
          <li>Vote Average: {result.vote_average}</li>
          <li>Vote Count: {result.vote_count}</li>
          {/* You can add more details here based on your data */}
        </ul>
        <div>
        
        <Button buttonStyle="btn--primary" onClick={() => handleAddToWatchlist(result)}>add to whatch list</Button>
        
</div>
      </div>
      

          
        </div><button onClick={onClose}>Close</button>
      </div>
    </>
  );
};
