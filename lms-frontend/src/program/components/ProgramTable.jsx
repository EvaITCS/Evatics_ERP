import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function ProgramTable({ programs, onDeleteProgram }) {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (programId, e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === programId ? null : programId);
    };

    const handleDelete = (programId) => {
        setActiveDropdown(null);
        if (window.confirm( "Are you sure you want to deactivate this program?")) {
            if (onDeleteProgram) {
                onDeleteProgram(programId);
            } else {
                console.log(`Delete program with ID: ${programId}`);
            }
        }
    };

    if (!programs || programs.length === 0) {
        return (
            <div className="table-empty">
                <h3>No Programs Found</h3>
                <p>Create a new program to see it here.</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="program-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Program Name</th>
                        <th>Program Code</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center", paddingRight: "32px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody ref={dropdownRef}>
                    {programs.map((program) => (
                        <tr key={program.programId}>
                            <td className="td-id">#{program.programId}</td>
                            <td className="td-name">{program.programName}</td>
                            <td>
                                <span className="code-badge">
                                    {program.programCode}
                                </span>
                            </td>
                            <td className="td-duration">
                                {program.durationValue || program.durationMonths} {program.durationType || "Months"}
                            </td>
                            <td>
                                {program.isActive ? (
                                    <span className="status-active">Active</span>
                                ) : (
                                    <span className="status-inactive">Inactive</span>
                                )}
                            </td>
                            
                            {/* PROFESSIONAL ACTIONS CELL */}
                            <td className="action-cell">
                                <button
                                    className="launch-batch-btn"
                                    disabled={!program.isActive}
                                    style={{ opacity: program.isActive ? 1 : 0.4, cursor: program.isActive ? "pointer" : "not-allowed" }}
                                    onClick={() => navigate(`/admin/batches/create?programId=${program.programId}`)}
                                >
                                    Launch Batch
                                </button>

                                <div className="action-dropdown-wrapper">
                                   <button
    className={`action-menu-btn ${
        activeDropdown === program.programId
            ? "active"
            : ""
    }`}
    disabled={!program.isActive}
    style={{
        opacity: program.isActive ? 1 : 0.4,
        cursor: program.isActive
            ? "pointer"
            : "not-allowed"
    }}
    onClick={(e) => toggleDropdown(program.programId, e)}
>
    ⋮
</button>

                                    {activeDropdown === program.programId && (
                                        <div className="dropdown-content-menu">
                                            <button
    className="edit-dropdown-item"
    disabled={!program.isActive}
    style={{
        opacity: program.isActive ? 1 : 0.5,
        cursor: program.isActive
            ? "pointer"
            : "not-allowed"
    }}
    onClick={() =>
        navigate(
            `/admin/programs/edit/${program.programId}`
        )
    }
>
    Edit Program
</button>

<button
    className="delete-dropdown-item"
    disabled={!program.isActive}
    style={{
        opacity: program.isActive ? 1 : 0.5,
        cursor: program.isActive
            ? "pointer"
            : "not-allowed"
    }}
    onClick={() =>
        handleDelete(program.programId)
    }
>
    Deactivate Program
</button>
                                        </div>
                                    )}
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}