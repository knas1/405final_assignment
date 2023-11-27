import React, { useState } from 'react';

const Auth = ({ onLogin, onLogout }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    const endpoint = 'auth.php'; // Endpoint for login and signup

    fetch(`http://localhost/405final_assignment/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, action: isLogin ? 'login' : 'signup' }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          onLogin(data.userId);
        } else {
          console.error('Authentication failed');
        }
      })
      .catch(error => console.error('Error during authentication:', error));
  };

  const handleToggleMode = () => {
    setIsLogin(prevState => !prevState);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div>
      {isLogin ? (
        <div>
          <h2>Login</h2>
        </div>
      ) : (
        <div>
          <h2>Sign Up</h2>
        </div>
      )}
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={handleAuth}>{isLogin ? 'Login' : 'Sign Up'}</button>
      <button onClick={handleToggleMode}>{isLogin ? 'Switch to Sign Up' : 'Switch to Login'}</button>
      {onLogout && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export default Auth;

