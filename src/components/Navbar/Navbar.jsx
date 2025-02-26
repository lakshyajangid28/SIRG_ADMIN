import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
      if (window.innerWidth >= 1000) {
        setMenuOpen(false);
        document.body.style.overflow = "auto";
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToHome = () => {
    setCurrentPage("home");
    navigate("/");
    closeMenu();
  };

  const handleScroll = (event) => {
    event.preventDefault();
    const targetId = event.target.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      closeMenu();
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    document.body.style.overflow = menuOpen ? "auto" : "hidden";
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div>
      <div className={`ui large menu ${isMobile ? "top fixed" : ""}`} id="navbar">
        {isMobile ? (
          <button className="mobile-menu" onClick={toggleMenu}>
            <i className="bars icon"></i>
          </button>
        ) : (
          <div className="sidebar-menu">
            {currentPage === "home" ? (
              <>
                <a className="item" href="#about" onClick={handleScroll}><i className="info circle icon"></i> About</a>
                <a className="item" href="#research" onClick={handleScroll}><i className="flask icon"></i> Research</a>
                <a className="item" href="#people" onClick={handleScroll}><i className="users icon"></i> People</a>
                <a className="item" href="#project" onClick={handleScroll}><i className="tasks icon"></i> Project</a>
                <a className="item" href="#achievements" onClick={handleScroll}><i className="trophy icon"></i> Achievements</a>
                <a className="item" href="#publications" onClick={handleScroll}><i className="newspaper outline icon"></i> Publications</a>
                <a className="item" href="#positions" onClick={handleScroll}><i className="briefcase icon"></i> Positions</a>
                <a className="item" href="#teaching" onClick={handleScroll}><i className="book icon"></i> Teaching</a>
                <a className="item" href="#contact" onClick={handleScroll}><i className="phone icon"></i> Contact</a>
              </>
            ) : (
              <a className="item" onClick={goToHome}><i className="home icon"></i>Go to home page</a>
            )}
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div className="mobile-dropdown">
          {currentPage === "home" ? (
            <>
              <a className="item" href="#about" onClick={handleScroll}><i className="info circle icon"></i> About</a>
              <a className="item" href="#research" onClick={handleScroll}><i className="flask icon"></i> Research</a>
              <a className="item" href="#people" onClick={handleScroll}><i className="users icon"></i> People</a>
              <a className="item" href="#project" onClick={handleScroll}><i className="tasks icon"></i> Project</a>
              <a className="item" href="#achievements" onClick={handleScroll}><i className="trophy icon"></i> Achievements</a>
              <a className="item" href="#publications" onClick={handleScroll}><i className="newspaper outline icon"></i> Publications</a>
              <a className="item" href="#positions" onClick={handleScroll}><i className="briefcase icon"></i> Positions</a>
              <a className="item" href="#teaching" onClick={handleScroll}><i className="book icon"></i> Teaching</a>
              <a className="item" href="#contact" onClick={handleScroll}><i className="phone icon"></i> Contact</a>
            </>
          ) : (
            <a className="item" onClick={goToHome}><i className="home icon"></i> Go to home page</a>
          )}
        <br /><br />
        </div>
      )}

      <style>
        {`
          #navbar {
            background: rgb(95, 219, 101);
            color: black;
          }
          .mobile-menu {
            position: absolute;
            right: 10px;
            top: 5px;
            background: none;
            border: none;
            cursor: pointer;
            z-index: 1000;
          }
          .menu-icon {
            width: 30px;
            height: 30px;
            filter: brightness(0) invert(1);
          }
          .sidebar-menu {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            width: 150px;
            background: rgb(95, 219, 101);
            display: flex;
            text-align: center;
            flex-direction: column;
            padding-top: 20px;
          }
          .mobile-dropdown {
            position: fixed;
            top: 40px;
            left: 0;
            width: 100%;
            background: rgba(106, 189, 112, 0.81);
            padding: 15px;
            display: flex;
            flex-direction: column;
            z-index: 999;
            transition: all 0.3s ease-in-out;
          }
          .mobile-dropdown .item {
            color: black;
            padding: 10px 15px;
            text-decoration: none;
            transition: background 0.3s;
          }
          .mobile-dropdown .item:hover {
            background: rgb(49, 54, 49);
          }
          @media (max-width: 1000px) {
            .sidebar-menu {
              display: none;
            }
            .mobile-menu {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;