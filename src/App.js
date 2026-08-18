import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import { AuthProvider } from './config/AuthContext';
import Login from './Login';
import Home from './Home';
import { APP_TITLE } from './config/appInfo';
import { selectIsAuthenticated } from './store/slices/authSlice';

export default function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    document.title = APP_TITLE;
  }, []);

  return (
    <div className="App">
      {isAuthenticated ? (
        <AuthProvider>
          <Home />
        </AuthProvider>
      ) : (
        <Login />
      )}
    </div>
  );
}
