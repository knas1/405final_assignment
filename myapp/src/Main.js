// Main.js
import React, { useState } from 'react';
import Auth from './Auth';
import App from './App';

const Main = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (userId) => {
    setLoggedIn(true);
    setUserId(userId);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId(null);
  };

  return (
    <div>
      {!loggedIn ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <App userId={userId} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Main;
