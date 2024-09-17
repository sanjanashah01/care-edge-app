import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../withRouter";
import Cookies from "js-cookie";
import avatar from "../../../assets/images/user/avtar.png";

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const userData = JSON.parse(Cookies.get("userData"));
  const [username, setusername] = useState(userData);

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.username);
      }
    }
  }, [props.success]);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DropdownToggle
          className="btn header-item"
          id="page-header-user-dropdown"
          tag="button"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative" }}>
              <img src={avatar} alt="Logo" />
              <svg
                style={{ position: "absolute", top: "15px", left: "15px" }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span
              className="d-none d-xl-inline-block ms-2 me-2"
              style={{ color: "white" }}
            >
              {username}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end" style={{ width: "100%" }}>
          <Link
            to="/logs"
            className="dropdown-item"
            onClick={() => setMenu(false)}
          >
            <span>{props.t("History")}</span>
            <i className="bx bx-log-in align-middle mx-2 text-primary" />
          </Link>
          <Link to="/logout" className="dropdown-item">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{props.t("Logout")}</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.25 20.25C11.25 20.4489 11.171 20.6397 11.0303 20.7803C10.8897 20.921 10.6989 21 10.5 21H4.5C4.30109 21 4.11032 20.921 3.96967 20.7803C3.82902 20.6397 3.75 20.4489 3.75 20.25V3.75C3.75 3.55109 3.82902 3.36032 3.96967 3.21967C4.11032 3.07902 4.30109 3 4.5 3H10.5C10.6989 3 10.8897 3.07902 11.0303 3.21967C11.171 3.36032 11.25 3.55109 11.25 3.75C11.25 3.94891 11.171 4.13968 11.0303 4.28033C10.8897 4.42098 10.6989 4.5 10.5 4.5H5.25V19.5H10.5C10.6989 19.5 10.8897 19.579 11.0303 19.7197C11.171 19.8603 11.25 20.0511 11.25 20.25ZM21.5306 11.4694L17.7806 7.71937C17.6399 7.57864 17.449 7.49958 17.25 7.49958C17.051 7.49958 16.8601 7.57864 16.7194 7.71937C16.5786 7.86011 16.4996 8.05098 16.4996 8.25C16.4996 8.44902 16.5786 8.63989 16.7194 8.78063L19.1897 11.25H10.5C10.3011 11.25 10.1103 11.329 9.96967 11.4697C9.82902 11.6103 9.75 11.8011 9.75 12C9.75 12.1989 9.82902 12.3897 9.96967 12.5303C10.1103 12.671 10.3011 12.75 10.5 12.75H19.1897L16.7194 15.2194C16.5786 15.3601 16.4996 15.551 16.4996 15.75C16.4996 15.949 16.5786 16.1399 16.7194 16.2806C16.8601 16.4214 17.051 16.5004 17.25 16.5004C17.449 16.5004 17.6399 16.4214 17.7806 16.2806L21.5306 12.5306C21.6004 12.461 21.6557 12.3783 21.6934 12.2872C21.7312 12.1962 21.7506 12.0986 21.7506 12C21.7506 11.9014 21.7312 11.8038 21.6934 11.7128C21.6557 11.6217 21.6004 11.539 21.5306 11.4694Z"
                  fill="#1C304C"
                ></path>
              </svg>
            </div>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { error, success } = state.profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
