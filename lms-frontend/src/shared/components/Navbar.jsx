import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../lead/components/NotificationBell";

function Navbar() {
  const role = localStorage.getItem("role") || "USER";

  const username =
    localStorage.getItem("fullName") ||
    localStorage.getItem("firstName") ||
    localStorage.getItem("email") ||
    "User";

  const [search, setSearch] = useState("");
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Hardcoded structural references matching your Sidebar layout definitions
  const routeRegistry = {
    ADMIN: [
      { name: "Dashboard", path: "/admin" },
      { name: "All Leads", path: "/admin/all-leads" },
      { name: "Add Lead", path: "/admin/add-lead" },
      { name: "Interested Leads", path: "/admin/interested" },
      { name: "Converted Leads", path: "/admin/converted" },
      { name: "Re-Engagement Leads", path: "/admin/re-engagement" },
      { name: "Employees List", path: "/admin/employees" },
      { name: "Add Employee", path: "/admin/employees/add" },
      { name: "Departments Setup", path: "/admin/departments" },
      { name: "Designations Setup", path: "/admin/designations" },
      { name: "Employment Types", path: "/admin/employment-types" },
      { name: "Employee Status Options", path: "/admin/employee-statuses" },
      {
        name: "Employee Documents Profiles",
        path: "/admin/employee-documents",
      },
      { name: "Employee Notes Portal", path: "/admin/employee-notes" },
      { name: "Employee Leaves Overview", path: "/admin/employee-leaves" },
      { name: "Leave Types Rule Setup", path: "/admin/leave-types" },
      { name: "Attendance Logs", path: "/admin/attendance" },
      {
        name: "Attendance Dashboard Visuals",
        path: "/admin/attendance-dashboard",
      },
      {
        name: "Attendance Regularization Requests",
        path: "/admin/attendance-regularization",
      },
      { name: "Shifts Scheduling", path: "/admin/shifts" },
      { name: "Office Locations Config", path: "/admin/locations" },
      { name: "Work Modes Customizer", path: "/admin/work-modes" },
      { name: "Holiday Calendar Setup", path: "/admin/holidays" },
    ],
    COUNSELLOR: [
      { name: "Dashboard", path: "/COUNSELLOR" },
      { name: "My Leads Dashboard", path: "/COUNSELLOR/my-leads" },
      { name: "Add New Lead Profile", path: "/COUNSELLOR/add-lead" },
      { name: "Interested Leads Pipeline", path: "/COUNSELLOR/interested" },
      { name: "Converted Leads Log", path: "/COUNSELLOR/converted" },
      { name: "Re-Engagement Leads Pool", path: "/COUNSELLOR/re-engagement" },
      { name: "Today's Followups Queue", path: "/COUNSELLOR/today-followups" },
      {
        name: "Pending Followups Alert",
        path: "/COUNSELLOR/pending-followups",
      },
      { name: "Today Summary Analytics", path: "/COUNSELLOR/today-summary" },
      { name: "Weekly Summary Analytics", path: "/COUNSELLOR/weekly-summary" },
      {
        name: "Monthly Summary Analytics",
        path: "/COUNSELLOR/monthly-summary",
      },
      { name: "Yearly Summary Analytics", path: "/COUNSELLOR/yearly-summary" },
      { name: "Attendance Check-In", path: "/COUNSELLOR/attendance" },
      { name: "System Reminders Log", path: "/COUNSELLOR/reminders" },
      { name: "Performance Reports", path: "/COUNSELLOR/reports" },
    ],
    EMPLOYEE: [
      { name: "My Profile Management", path: "/employee/profile" },
      { name: "Attendance Check-In Logs", path: "/employee/attendance" },
      { name: "My Leaves Balance", path: "/employee/leaves" },
      { name: "Apply Leave Request Form", path: "/employee/apply-leave" },
      { name: "Holiday Calendar Planner", path: "/employee/holidays" },
    ],
    TRAINER: [
      { name: "Dashboard", path: "/trainer" },
      { name: "My Batches", path: "/trainer/batches" },
      { name: "My Students", path: "/trainer/students" },
      { name: "Create Task", path: "/trainer/CreateTasks" },
      { name: "View Tasks", path: "/trainer/ViewTasks" },
      { name: "Change Password", path: "/trainer/change-password" },
      { name: "My Leaves", path: "/trainer/leaves" },
      { name: "Apply Leave", path: "/trainer/apply-leave" },
      { name: "Holiday Calendar", path: "/trainer/holidays" },
    ],
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredLinks([]);
      return;
    }

    const userAvailableRoutes = routeRegistry[role.toUpperCase()] || [];
    const matches = userAvailableRoutes.filter((route) =>
      route.name.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredLinks(matches);
  }, [search, role]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRoute = (path) => {
    setSearch("");
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      {/* LEFT - Welcome Message */}
      <div className="nav-left">
        <h2>
          Welcome Back,{" "}
          <span>{localStorage.getItem("firstName") || username}</span>
        </h2>
      </div>

      {/* CENTER - Search Box */}
      <div className="nav-center" ref={dropdownRef}>
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Type to search pages..."
            value={search}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            className="search-bar"
          />

          {/* DROPDOWN VIEW */}
          {showDropdown && filteredLinks.length > 0 && (
            <ul className="search-results-dropdown">
              {filteredLinks.map((link, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectRoute(link.path)}
                  className="dropdown-item"
                >
                  <span className="item-name">{link.name}</span>
                  <span className="item-path">{link.path}</span>
                </li>
              ))}
            </ul>
          )}

          {/* NO RESULTS DISPLAY */}
          {showDropdown &&
            search.trim() !== "" &&
            filteredLinks.length === 0 && (
              <div className="search-results-dropdown no-results">
                No matching pages found
              </div>
            )}
        </div>
      </div>

      {/* RIGHT - Profile Card */}
      <div className="nav-right">

        <NotificationBell />

        <div className="user-card">

          <div className="user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="user-details">
            <h4>{username}</h4>
            <span>{role}</span>
          </div>

        </div>

      </div>


    </nav>
  );
}

export default Navbar;
