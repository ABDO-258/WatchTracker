import React, { useState } from 'react';
import './SideBar.css';
import SearchBar from './search/SearchBar';
import SearchResultsList from './search/SearchResultsList';

function SideBar() {
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to track popup visibility
    const [results, setResults] = useState([]);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen); // Toggle popup state on icon click
  };
  return (
    <>
      <div className="sidebar-container">
        <ul className='list'>
            <li onClick={togglePopup}> {/* Add onClick handler to the list item */}
            {/* Your icon element (replace with actual icon component) */}
            <i className="fa-solid fa-circle-plus">add show</i>
          </li>
        </ul>
        {isPopupOpen && ( // Conditionally render popup content based on state
          <div className="popup">
            {/* Your popup content here (e.g., form, information) */}
            <div className='search-bar-container'>
                            <SearchBar setResults={ setResults }/>
                            <div className='search-result-container'>
                                <SearchResultsList results={results}/>
                            </div>
                        </div> 
            <button onClick={togglePopup}>Close</button>
          </div>
        )}
      </div>
    </>
  )
}

export default SideBar
