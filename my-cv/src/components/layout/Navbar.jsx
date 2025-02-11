import React, { useContext, useState } from 'react';
import { Link} from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import './Navbar.css'; // Import the CSS file

/**
 * Navbar component that displays navigation links and login/logout options.
 */
const Navbar = () => {
  const { token } = useContext(AuthContext);
  // const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Handle logout action, close the mobile menu if open, and navigate to home.
   */
  // const handleLogout = () => {
  //   logout();
  //   setMobileMenuOpen(false);
  //   navigate('/');
  // };

  /**
   * Toggle the mobile menu open/close state.
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">Abhishek</Link>
      </div>
      <div className={`navbar__menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>
          Home
        </Link>
        <Link to="/cv" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>
          MY CV
        </Link>
        {token && (
          <Link to="/dashboard" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
        )}
        {/* <div className="navbar__auth">
          {token ? (
            <button className="navbar__button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>
              <button className="navbar__button">Login</button>
            </Link>
          )}
        </div> */}
      </div>
      <div className="navbar__toggle" onClick={toggleMobileMenu}>
        <span className="navbar__toggle-bar"></span>
        <span className="navbar__toggle-bar"></span>
        <span className="navbar__toggle-bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
