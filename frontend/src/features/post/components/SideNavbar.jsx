import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/auth.context";
import { toast } from "react-toastify";
import "../style/sidenavbar.scss";

const SideNavbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Logout from account?")) return;

    // clear cookie session
    document.cookie = "token=; Max-Age=0";

    setUser(null);
    toast.success("Logged out");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="logo">
        <i className="fa-brands fa-instagram"></i>
        <span>InstaXG</span>
      </div>

      {/* NAV LINKS */}
      <nav className="nav-links">

        <NavLink to="/" className="nav-item">
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </NavLink>

        <NavLink to="/search" className="nav-item">
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Search</span>
        </NavLink>

        <NavLink to="/create" className="nav-item">
          <i className="fa-solid fa-plus-square"></i>
          <span>Create</span>
        </NavLink>

        <NavLink to={`/profile/${user?.username}`} className="nav-item">
          <i className="fa-regular fa-user"></i>
          <span>Profile</span>
        </NavLink>

      </nav>

      {/* USER INFO + LOGOUT */}
      <div className="sidebar-bottom">

        <div className="user-box">
          <img
            src={
              user?.profilePic ||
              "https://i.pravatar.cc/150?img=65"
            }
            alt="user"
          />
          <span>{user?.username}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>

      </div>

    </aside>
  );
};

export default SideNavbar;