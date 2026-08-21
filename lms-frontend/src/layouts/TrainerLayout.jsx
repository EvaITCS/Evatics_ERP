import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/Sidebar";
import Navbar from "../shared/components/Navbar";

export default function TrainerLayout() {

    return (

        <div className="layout">

            <Sidebar role="TRAINER" />

            <div className="main-content">

                <Navbar />

                <div className="page-content">

                    <Outlet />

                </div>

            </div>

        </div>

    );
}