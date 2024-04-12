import React, { useState } from 'react'
import "./SearchBar.css"

function SearchBar ({ setResults }) {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    // Build the API url with your search query
    const apiKey = '02b8aead503b7db689db95a3fa599473'; // Replace with your TMDB API key
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${value}`;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const results = json.results || []; // Handle cases where no results exist
  
        // Filter movies based on title search (modify as needed)
        const filteredResults = results.filter((show) => {
          return show.name && show.name.toLowerCase().includes(value);
        });
        console.log(filteredResults)
        setResults(filteredResults);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };
  const handleClick = () => {
    fetchData(input); // Use the current input value
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };
  return (
    <>
    <div className='input-wrapper'>
      
      <input placeholder="Type to search..."
      value={input}
      onChange={(e) => handleChange(e.target.value)}
      >
      </input>
      <i id="search-icon" className="fa-solid fa-magnifying-glass" onClick={handleClick}></i>
    </div>
    </>
  )
}
export default SearchBar;

