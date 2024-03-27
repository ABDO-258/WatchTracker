import React, { useState, useEffect } from 'react';
import './WatchList.css';

function WatchList() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Render watchlist items based on state
  return (
    <div >
      <h2>My Watchlist</h2>
      {isLoading && <p>Loading watchlist...</p>}
      {error && <p>Error: {error}</p>}
      {watchlist.length > 0 ? (
        <>
        <div className='container'>
          {watchlist.map((show) => (
            
              <div className='list-container'>
                <div className='row'>
                  <img
                  src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                  alt={show.name}
                  />
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


