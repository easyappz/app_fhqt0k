import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Register from './components/Register';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;