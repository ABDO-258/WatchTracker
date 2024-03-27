import React from 'react'
import './SearchResultsList.css'
import { SearchResult } from "./SearchResult";

 function SearchResultsList({ results }) {
  return (
    <ul className="results-list">
      {results.map((result) => (
        <li className="movie-item">
           <div className='test'>
            <img 
              src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
              alt={result.title}
              className="movie-poster" 
          
            />
            <SearchResult key={result.id} result={result} />
            </div>
        </li>
        ))}
    </ul>
  )
};

export default SearchResultsList;
