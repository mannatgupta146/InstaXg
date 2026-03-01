import React from "react";
import { Outlet } from "react-router-dom";
import SideNavbar from "../features/post/components/SideNavbar";

const MainLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <SideNavbar />

      <div style={{ marginLeft: "240px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;