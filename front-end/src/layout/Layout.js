import React from "react";
import Routes from "./Routes";
import Menu from "./Menu";

/**
 * Defines the main layout of the application.
 * You will not need to make changes to this file.
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div
      className="container-fluid"
      style={{
        fontFamily: "'Ubuntu', sans-serif",
        backgroundColor: "#FFB93A",
        color: "#ffffff",
        height: "2000px"
      }}
    >
      <div className="row">
        <div className="col-1 p-0">
          <Menu />
        </div>
        <div className="col-10">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
