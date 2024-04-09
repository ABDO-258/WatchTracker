import React, { useState, useEffect } from 'react';
import axios from 'axios'

function ShowInfo({ onClose, result }) {
    const [selectedStatus, setSelectedStatus] = useState(result.status); // Initialize selected status with current status
    
    console.log(result);


    useEffect(() => {
        setSelectedStatus(result.status); // Update selectedStatus when result.status changes
    }, [result.status]);


    
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

    const handleDeleteShow = async () => {
        // Send a DELETE request to delete the show from the watchlist
        const csrfToken = await fetchCsrfToken();
        try {
            const response = await fetch(`/api/watchlist/delete/${result.show_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken

                }
            });
            if (response.ok) {
                // Show deleted successfully, you may want to update UI accordingly
                console.log('Show deleted successfully');
            } else {
                // Failed to delete show, handle the error
                console.error('Failed to delete show');
            }
        } catch (error) {
            // Handle network errors
            console.error('Network error:', error);
        }
    };

    // handle status update 
    const updateWatchlistStatus = async (watchlistEntryId, newStatus) => {
        const csrfToken = await fetchCsrfToken();
        try {
            const response = await fetch(`/api/watchlist/update-status/${watchlistEntryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    status: newStatus,
                }),
            });
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Error updating watchlist status:', error);
        }
    };
    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus); // Update selectedStatus immediately
        await updateWatchlistStatus(result.id, newStatus); // Trigger status update API request
    };

    const handleClickInsidePopup = (e) => {
        // Prevent closing the popup when interacting with its content
        e.stopPropagation(); // Stop event propagation to parent elements
    };

    return (
        <>
            
            <div className="popup" onClick={handleClickInsidePopup}>
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
                        <p>status: {result.status}</p>
                        {/* Dropdown menu for selecting status */}
                        <select
                            value={selectedStatus}
                            onChange={ handleStatusChange }>
                                <option value="watching">Watching</option>
                                <option value="completed">Completed</option>
                                <option value="dropped">Dropped</option>
                        </select>

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
                            {/* Button to delete show */}
                            <button onClick={handleDeleteShow}>Delete Show</button>
                        </div>
                    </div>
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </>
    );
}

export default ShowInfo;
