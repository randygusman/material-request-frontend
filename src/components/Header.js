import React, { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';
import { useRouter } from 'next/router';

const Header = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    }
  }, []); 

  const handleMaterialRequest = () => {
    if (role === 'Production' || role === 'Warehouse') {
      router.push('/material-requests');
    } else {
      // Handle redirection or show an error message if necessary
      alert('You do not have permission to access this page');
    }
  };

  const handleHistory = () => {
    router.push('/history'); // Redirect to the history page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Material Request System
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="/dashboard">
                Dashboard
              </a>
            </li>
            {(role === 'Production' || role === 'Warehouse') && (
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleMaterialRequest}>
                  Material Request
                </a>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleHistory}>
                History
              </a>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <span className="me-3">
              {username} ({role})
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
