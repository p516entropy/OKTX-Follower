import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

import './style.css';

class Header extends Component {
  render() {
    return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark" style={{"backgroundColor": "#000"}}>
        <div className="container">
          <Link className="navbar-brand font-monospace" to="/">OKTX Follower</Link>
          <button className="navbar-toggler" type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarCollapse"
                  aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarCollapse">
            <ul className="navbar-nav">
              <div className="dropdown ">
                <a
                  className="dropdown-toggle"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark listRight">
                  <li>
                    <NavLink className="dropdown-item" to="/">Logout</NavLink>
                  </li>
                </ul>
              </div>

            </ul>
          </div>
        </div>
      </nav>
    </header>
    )
  }
}

export default Header;