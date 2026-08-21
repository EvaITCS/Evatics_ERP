import { Outlet } from "react-router-dom";

import Sidebar from "../shared/components/Sidebar";
import Navbar from "../shared/components/Navbar";

function COUNSELLORLayout() {
  return (
    <div className="layout">
      <Sidebar role="COUNSELLOR" />

      <div className="main-content">
        <Navbar />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default COUNSELLORLayout;
