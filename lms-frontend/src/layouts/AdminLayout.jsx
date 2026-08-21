import { Outlet } from "react-router-dom";

import Sidebar from "../shared/components/Sidebar";

import Navbar from "../shared/components/Navbar";

// =====================================
// LEAD STYLES
// =====================================

import "../lead/styles/lead.css";

// =====================================
// EMPLOYEE STYLES
// =====================================

import "../employee/styles/employee.css";

// import "../attendance/styles/attendance.css";



function AdminLayout() {

    return (

        <div className="layout">
  <Sidebar role="ADMIN" />
    <div className="main-content">

                <Navbar />

             
                <div className="page-content">

                    <Outlet />

                </div>

            </div>

        </div>
    );
}

export default AdminLayout;