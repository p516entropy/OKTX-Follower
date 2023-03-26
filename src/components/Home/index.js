import React, { Component } from 'react';
import './style.css';
import {Link} from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <>
        <div className="Home" style={{"height": "50vh"}}>
        <Link type="button" className="btn btn-primary btn-lg" to="/contract">Follow transaction activities</Link>
        </div>
      </>
    )
  }
}

export default Home;