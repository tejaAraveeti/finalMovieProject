import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("access_token");
    if (!token) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  const logoutHandler = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <Link className="navbar-brand custom-brand"  to="/">
        MyMovies
      </Link>

      <div className="navbar-collapse justify-content-end">
        <div className="form-inline my-2 my-lg-0">
          {loggedIn ? (
            <button className="btn btn-danger" onClick={logoutHandler}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
