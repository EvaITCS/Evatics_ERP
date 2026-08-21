import React, { useState } from "react";
import Sidebar from "../../shared/components/Sidebar";
import Navbar from "../../shared/components/Navbar";
import "../styles/trainer.css";
import "../../shared/styles/sidebar.css";

export default function TrainerTable({ trainers }) {
  
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="trainer-layout">
        
            <Sidebar role="TRAINER" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

           
            <div className={`trainer-main ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                <Navbar />

                <div className="trainer-content">
                    /* The responsive wrapper handles the table container safety shield */
                    <div className="table-responsive-wrapper">

                        <table className="trainer-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Specialization</th>
                                    <th>Experience</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {trainers && trainers.length > 0 ? (
                                    trainers.map((trainer) => (
                                        <tr key={trainer.trainerId}>
                                            <td>
                                                {trainer.trainerId}
                                            </td>
                                            
                                            <td>
                                                {trainer.trainerName}
                                            </td>
                                            
                                            <td>
                                                {trainer.specialization}
                                            </td>
                                            
                                            <td>
                                                {trainer.experienceYears} Years
                                            </td>
                                            
                                            <td>
                                                {/* Wrapped in status class to enable the premium badge layout */}
                                                <span className={`status ${trainer.status}`}>
                                                    {trainer.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "var(--text-tertiary)" }}>
                                            No trainers available
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}