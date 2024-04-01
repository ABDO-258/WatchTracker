
import React, { useState } from 'react';

//import { Button } from './Button';

function ShowInfo({ result } ) {
    const [showPopup, setShowPopup] = useState(false);
    console.log(result);

    const handlePopupClose = () => {
    setShowPopup(!showPopup);
    };

  return (
    <>
      <div className="popup-backdrop" onClick={handlePopupClose} />
      <div className="popup">
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
                
        </div>
        </div>
      

          
        </div>
        <button onClick={handlePopupClose}>Close</button>
      </div>
    </>
  )
}

export default ShowInfo
