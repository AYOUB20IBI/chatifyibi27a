import { Link } from "react-router-dom";
import style from "./navbar.module.css";
import logo from "../../assets/images/logo3.png";

function Navbar() {
  return (
    <>
      <nav data-aos="flip-left"
        className={`navbar navbar-expand-lg fixed-top ${style.navbar_back}`}
        id={`${style.navbar_backv2}`}
      >
        <div className="container-fluid">
          <Link className="navbar-brand me-auto" to="/">
            <img src={logo} alt="logo" width="120px" />
          </Link>

          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id={`offcanvasNavbar`}
            aria-labelledby="offcanvasNavbarLabel"

          >
            <div className="offcanvas-header  justify-content-between">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                <img src={logo} alt="logo" width="120px" />
              </h5>
              <button
                type="button"
                className={`${style.btn_close}`}
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                <li className={`list nav-item ${style.active_link}`}>
                  <Link
                    className={`nav-link ${style.active} mx-lg-2 ${style.nav_link}`}
                    aria-current="page"
                    to="/"
                    onClick={() => {
                      document.getElementById('offcanvasNavbar').classList.remove('show');
                    }}
                    aria-label="Close"
                  >
                    <i className="bi bi-house-door-fill me-1"></i> Home
                  </Link>
                </li>
                <li className={`list nav-item`}>
                  <Link
                    className={`nav-link mx-lg-2 ${style.nav_link}`}
                    to="/about"
                    onClick={() => {
                      document.getElementById('offcanvasNavbar').classList.remove('show');
                    }}
                    aria-label="Close"
                  >
                    <i className="bi bi-person-fill me-1"></i> About
                  </Link>
                </li>
                <li className={`list nav-item`}>
                  <Link
                    className={`nav-link mx-lg-2 ${style.nav_link}`}
                    to="/contact"
                    onClick={() => {
                      document.getElementById('offcanvasNavbar').classList.remove('show');
                    }}
                    aria-label="Close"
                  >
                    <i className="bi bi-envelope-at-fill me-1"></i> Contact
                  </Link>
                </li>
                <li className={`list nav-item`}>
                  <Link
                    className={`nav-link mx-lg-2 ${style.nav_link}`}
                    to="/ourteam"
                    onClick={() => {
                      document.getElementById('offcanvasNavbar').classList.remove('show');
                    }}
                    aria-label="Close"
                  >
                    <i className="bi bi-three-dots me-1"></i> More
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div id={`${style.show_login_mini}`}>
            <div>
              <Link className="btn btn-orange" to="/registre" id={`${style.btn_get_started}`}>
                <i className="bi bi-chat-left-dots-fill me-1"></i>Free Trial
              </Link>
            </div>
          </div>
          <button
            className={`${style.btn_toggel}`}
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-menu-button-wide-fill text-light"></i>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
