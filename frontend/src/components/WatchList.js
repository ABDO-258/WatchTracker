import React, { useState, useEffect } from 'react';
import './WatchList.css';
import ReactDOM from 'react-dom';
import ShowInfo from './ShowInfo';

function WatchList() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePopupIndex, setActivePopupIndex] = useState(null); // Track active popup index

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const response = await fetch('/api/watchlist'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch watchlist data');
        }
        const data = await response.json();
        setWatchlist(data.watchlist);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, []);  // Empty dependency array to run only once

  const togglePopup = (index) => {
    setActivePopupIndex(activePopupIndex === index ? null : index);
  }
  // Render watchlist items based on state
  return (
    <div >
      <h2>My Watchlist</h2>
      {isLoading && <p>Loading watchlist...</p>}
      {error && <p>Error: {error}</p>}
      {watchlist.length > 0 ? (
        <>
        <div className='container'>
          {watchlist.map((show, index) => (
            
              <div className='list-container' key={index} onClick={() => togglePopup(index)}>
                <div className='row'>
                  <img
                  src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                  alt={show.name}
                  />
                  <div className='name'>{show.name}</div>
                </div>
                <div className='shows-info' >
                  {activePopupIndex === index && (
                    ReactDOM.createPortal(
                      <ShowInfo 
                      onClose={() => setActivePopupIndex(null)} // Close popup on onClose event
                      result={show} />,
                    document.body
                    )     
                  )}

                </div> 
              </div>
              
            
          ))}
        </div>

        </>
      ) : (
        <p>Your watchlist is empty.</p>
      )}
    </div>
  );
}

export default WatchList;


