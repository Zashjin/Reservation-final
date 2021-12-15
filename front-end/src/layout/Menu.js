/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <div>
      <nav className="nav navbar-nav mt-3 bg-white" style={{ position: "fixed", zIndex: "2" }}>
        <ul className="nav navbar-nav">
          <li className="nav-item pl-1">
            <button
              type="button"
              className="btn"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Home"
            >
              <Link className="nav-link " to="/">
                <img
                  style={{ color: "black" }}
                  src="https://img.icons8.com/material-rounded/24/000000/home.png"
                />
              </Link>
            </button>
          </li>

          <li className="nav-item pl-1">
            <button
              type="button"
              className="btn"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Search"
            >
              <Link className="nav-link " to="/search">
                <img src="https://img.icons8.com/material-outlined/24/000000/search--v1.png" />
              </Link>
            </button>
          </li>
          <li className="nav-item pl-1">
            <button
              type="button"
              className="btn"
              data-toggle="tooltip"
              data-placement="bottom"
              title="New Reservation"
            >
              <Link className="nav-link " to="/reservations/new">
                <img
                  className=""
                  src="https://img.icons8.com/ios-filled/24/000000/reservation.png"
                />
              </Link>
            </button>
          </li>
          <li className="nav-item pl-1">
            <button
              type="button"
              className="btn"
              data-toggle="tooltip"
              data-placement="bottom"
              title="New Table"
            >
              <Link className="nav-link " to="/tables/new">
                <img src="https://img.icons8.com/material-outlined/24/000000/table.png" />
              </Link>
            </button>
          </li>
        </ul>
        <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </nav>
    </div>
  );
}

export default Menu;
