import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../shared/components/Sidebar";

const ResourceLayout = () => {
    return (
        <div className="layout">
            {/* Admin Sidebar */}
            <Sidebar role="ADMIN" />

            {/* Resource Content */}
            <div className="main-content">
                <div className="page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ResourceLayout;