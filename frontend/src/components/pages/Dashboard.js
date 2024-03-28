import React, { useState, useEffect } from 'react';
import '../../App.css';
import './Dashboard.css';
import { Link } from 'react-router-dom';

import { Button } from '../Button';
import Footer from '../Footer';
//import SearchBar from '../search/SearchBar';
//import SearchResultsList from '../search/SearchResultsList';
import SideBar from '../SideBar';
import WatchList from '../WatchList';
function Dashboard() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //const [results, setResults] = useState([]);

    useEffect(() => {
        fetch('/is_logged_in')
            .then(response => response.json())
            .then(data => setIsLoggedIn(data.is_logged_in))
            .catch(error => console.error(error));
    }, []);
        
    return (
          isLoggedIn ? (
            <>
                <div className='dashboard'>
                    <SideBar/>
                    <div className="content">
                        <WatchList/>
                        
                        {/* <div className='search-bar-container'>
                            <SearchBar setResults={ setResults }/>
                            <div className='search-result-container'>
                                <SearchResultsList results={results}/>
                            </div>
                        </div>  */}
                        
                    </div>
                </div>
                <Footer/>
            </>
          ) : (
            <>
                <div className='dashboard'>
                    <h2>Please log in to access the dashboard.</h2>
                    <div className='dashboard-btns'>
                        <Link to="/sign-in" className="btn-container">
                        <Button className='btns'
                                buttonStyle='btn--outline'
                                buttonSize='btn--large'>SIGN IN</Button>
                        </Link>
                    </div>
                </div>
                <Footer/>
            </>
          )
        );
};

export default Dashboard;