import React, { Component } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

class Footer extends Component {
  render() {
    return (
      <footer className="footer mt-auto py-3 bg-dark">
        <div className="container">
          <span className="text-white">&copy;&nbsp;2023 <a href='https://github.com/p516entropy'>p515entropy</a></span>
        </div>
      </footer>
    )
  }
}

export default Footer;