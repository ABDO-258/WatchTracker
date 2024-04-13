import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const IsLoggedIn = () => {
    fetch('/is_logged_in')
      .then(response => response.json())
      .then(data => {
        if (data.is_logged_in) {
          setIsLoggedIn(true);
        }
      })
      .catch(error => console.error(error));
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, IsLoggedIn  }}>
      {children}
    </AuthContext.Provider>
  );
};