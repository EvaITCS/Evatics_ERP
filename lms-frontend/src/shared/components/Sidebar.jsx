import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../../api/axios";

function Sidebar({ role }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const [openSubMenu, setOpenSubMenu] = useState(null);
  const username = localStorage.getItem("username") || "User";

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.log(e);
    } finally {
      localStorage.clear();

      navigate("/");
    }
  };

  const adminLinks = [

    {
      title: "Dashboard",
      path: "/admin",
    },

    // =====================================
    // LEAD MANAGEMENT
    // =====================================

    {
      title: "Lead Management",

      links: [

        { name: "All Leads", path: "/admin/all-leads" },

        { name: "My Leads", path: "/admin/my-leads" },

        { name: "Add Lead", path: "/admin/add-lead" },

        { name: "Today's Followups", path: "/admin/today-followups" },

        { name: "Pending Followups", path: "/admin/pending-followups" },

        { name: "Notifications", path: "/admin/notifications" },

        { name: "Interested Leads", path: "/admin/interested" },

        { name: "Converted Leads", path: "/admin/converted" },

        { name: "Re-Engagement Leads", path: "/admin/re-engagement" },

      ],

    },

    // =====================================
    // LEAD ANALYTICS
    // =====================================

    {
      title: "Lead Analytics",
      path: "/admin/lead-analytics",
    },

    // =====================================
    // LEAD IMPORT
    // =====================================

    {
      title: "Lead Import",
      path: "/admin/lead-import",
    },

    // =====================================
    // STUDENT MANAGEMENT
    // =====================================

    {
      title: "Student Management",

      links: [

        {
          name: "Student Applications",
          path: "/admin/applications",
        },

        {
          name: "Enrolled Students",
          path: "/admin/students",
        },

        {
          name: "My Students",
          path: "/admin/my-students",
        },

         {
      name: "Profile Change Requests",
      path: "/admin/profile-change-requests",
    },

        {
          name: "Contracts",
          path: "/admin/contracts",
        },
        {
          name: "Student Support",
          path: "/admin/student-support",
        },



        // {
        //   name: "Student Credentials",
        //   path: "/admin/student-credentials",
        // },

      ],

    },

    // =====================================
    // PROGRAM MANAGEMENT
    // =====================================



    // {
    //   title: "Project Builder",
    //   path: "/admin/resource/industry-capstone",
    // },

    // {
    //   title: "Resume Generator",
    //   path: "/admin/resource/resume-generator",
    // },


    {
      title: "Program Management",

      links: [

        {
          name: "All Programs",
          path: "/admin/programs",
        },

        {
          name: "Add Program",
          path: "/admin/programs/create",
        },

      ],

    },

    // =====================================
    // BATCH MANAGEMENT
    // =====================================

    {
      title: "Batch Management",

      links: [

        {
          name: "Batch Dashboard",
          path: "/admin/batches/dashboard",
        },

        {
          name: "All Batches",
          path: "/admin/batches/list",
        },

        {
          name: "Create Batch",
          path: "/admin/batches/create",
        },

      ],

    },

    // =====================================
    // OPERATIONS
    // =====================================

    {
      title: "Operations",

      subMenus: [

        {

          title: "Employee Management",

          links: [

            {
              name: "Employees",
              path: "/admin/employees",
            },

            {
              name: "Add Employee",
              path: "/admin/employees/add",
            },

            {
              name: "Departments",
              path: "/admin/departments",
            },

            {
              name: "Designations",
              path: "/admin/designations",
            },

            {
              name: "Locked Users",
              path: "/admin/locked-users",
            },

          ],

        },

        {

          title: "Leave Management",

          links: [

            {
              name: "Employee Leaves",
              path: "/admin/employee-leaves",
            },

            {
              name: "Leave Types",
              path: "/admin/leave-types",
            },

          ],

        },

        {

          title: "Others",

          links: [

            {
              name: "Shifts",
              path: "/admin/shifts",
            },

            {
              name: "Locations",
              path: "/admin/locations",
            },

            {
              name: "Work Modes",
              path: "/admin/work-modes",
            },

            {
              name: "Holidays",
              path: "/admin/holidays",
            },

          ],

        },

      ],

    },

    // =====================================
    // TRAINER MANAGEMENT
    // =====================================

    // {
    //   title: "Trainer Management",

    //   links: [

    //     {
    //       name: "Drop Requests",
    //       path: "/admin/drop-requests",
    //     },

    //   ],

    // },

    // =====================================
    // MY ACCOUNT
    // =====================================

    {
      title: "My Account",

      links: [

        {
          name: "Change Password",
          path: "/admin/change-password",
        },

      ],

    },

  ];

  const COUNSELLORLinks = [

    // =====================================
    // DASHBOARD
    // =====================================

    {
      title: "Dashboard",
      path: "/COUNSELLOR",
    },

    // =====================================
    // LEAD MANAGEMENT
    // =====================================

    {
      title: "Lead Management",

      links: [

        {
          name: "My Leads",
          path: "/COUNSELLOR/my-leads",
        },

        {
          name: "Add Lead",
          path: "/COUNSELLOR/add-lead",
        },

        {
          name: "Today's Followups",
          path: "/COUNSELLOR/today-followups",
        },

        {
          name: "Pending Followups",
          path: "/COUNSELLOR/pending-followups",
        },

        {
          name: "Notifications",
          path: "/COUNSELLOR/notifications",
        },

        {
          name: "Interested Leads",
          path: "/COUNSELLOR/interested",
        },

        {
          name: "Converted Leads",
          path: "/COUNSELLOR/converted",
        },

        {
          name: "Re-Engagement Leads",
          path: "/COUNSELLOR/re-engagement",
        },

      ],

    },

    // =====================================
    // STUDENT MANAGEMENT
    // =====================================

    {
      title: "Student Management",

      links: [

        {
          name: "My Students",
          path: "/COUNSELLOR/my-students",
        },

        {
      name: "Profile Change Requests",
      path: "/COUNSELLOR/profile-change-requests",
    },

        // {
        //   name: "Student Credentials",
        //   path: "/COUNSELLOR/student-credentials",
        // },

        {
          name: "Student Support",
          path: "/COUNSELLOR/student-support",
        },

      ],

    },

    // =====================================
    // DROP REQUESTS
    // =====================================

    // {
    //   title: "Drop Requests Management",

    //   path: "/COUNSELLOR/drop-requests",

    // },

    // =====================================
    // REVIEW SUMMARY
    // =====================================

    {
      title: "Review Summary",

      path: "/COUNSELLOR/lead-analytics",

    },

    // =====================================
    // MY ACCOUNT
    // =====================================

    {
      title: "My Account",

      subMenus: [

        {

          title: "Profile Settings",

          links: [

            {
              name: "My Profile",
              path: "/COUNSELLOR/profile",
            },

            {
              name: "Change Password",
              path: "/COUNSELLOR/change-password",
            },

          ],

        },

        {

          title: "Employee Leave Management",

          links: [

            {
              name: "My Leaves",
              path: "/COUNSELLOR/leaves",
            },

            {
              name: "Apply Leave",
              path: "/COUNSELLOR/apply-leave",
            },

          ],

        },

        // {
        //
        //   title: "Holiday Calendar",
        //
        //   links: [
        //
        //     {
        //       name: "View Calendar",
        //       path: "/COUNSELLOR/holidays",
        //     },
        //
        //   ],
        //
        // },

      ],

    },

  ];

  const employeeLinks = [
    {
      title: "My Account",
      links: [
        { name: "My Profile", path: "/employee/profile" },

        {
          name: "Change Password",
          path: "/employee/change-password",
        },
      ],
    },
    // {
    //     title: "Attendance",
    //     links: [{ name: "Attendance", path: "/employee/attendance" }]
    // },
    {
      title: "Leave Management",
      links: [
        { name: "My Leaves", path: "/employee/leaves" },
        { name: "Apply Leave", path: "/employee/apply-leave" },
      ],
    },
    // {
    //   title: "Holidays",
    //   links: [{ name: "Holiday Calendar", path: "/employee/holidays" }],
    // },
  ];

  const trainerLinks = [
    {
      title: "Dashboard",
      path: "/trainer",
    },

    {
      title: "Training Management",
      links: [
        {
          name: "My Batches",
          path: "/trainer/batches",
        },

        {
          name: "Drop Requests",
          path: "/trainer/drop-requests",
        },
      ],
    },

    {
      title: "Task Management",
      links: [
        {
          name: "Create Task",
          path: "/trainer/CreateTasks",
        },
        {
          name: "View Tasks",
          path: "/trainer/ViewTasks",
        },
      ],
    },

    {
      title: "Leave Management",
      links: [
        {
          name: "My Leaves",
          path: "/trainer/leaves",
        },
        {
          name: "Apply Leave",
          path: "/trainer/apply-leave",
        },
      ],
    },

    // {
    //   title: "Holiday Calendar",
    //   path: "/trainer/holidays",
    // },

    {
      title: "My Account",
      links: [
        {
          name: "Change Password",
          path: "/trainer/change-password",
        },
      ],
    },
  ];

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "COUNSELLOR"
        ? COUNSELLORLinks
        : role === "TRAINER"
          ? trainerLinks
          : role === "EMPLOYEE"
            ? employeeLinks
            : [];

  return (
    <>
      {/* Menu Toggle Button available globally over layouts */}
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>Evatics ERP</h2>
          <p>{role || "User Dashboard"}</p>
        </div>

        <nav className="sidebar-menu">
          {links.map((section, index) => {
            const isExpanded = openMenu === index;

            return (
              <div
                key={index}
                className={`sidebar-group ${isExpanded ? "expanded" : ""}`}
              >
                {/* Direct Link Sections */}
                {section.path ? (
                  <Link
                    to={section.path}
                    className="sidebar-title"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <span>{section.title}</span>
                  </Link>
                ) : (
                  <>
                    {/* Main Dropdown */}
                    <div
                      className="sidebar-title"
                      onClick={() => setOpenMenu(isExpanded ? null : index)}
                    >
                      <span>{section.title}</span>

                      <span className="arrow-indicator">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="sidebar-group-items">
                        {/* Section Links */}
                        {section.links?.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className={
                              location.pathname === link.path ? "active" : ""
                            }
                          >
                            {link.name}
                          </Link>
                        ))}

                        {/* Sub Menus */}
                        {section.subMenus?.map((subMenu, subIndex) => {
                          const subKey = `${index}-${subIndex}`;

                          const isSubExpanded = openSubMenu === subKey;

                          return (
                            <div key={subKey}>
                              {/* Direct Submenu Link */}
                              {subMenu.path ? (
                                <Link
                                  to={subMenu.path}
                                  className="sidebar-title"
                                  style={{
                                    marginLeft: "15px",
                                    fontSize: "13px",
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                >
                                  {subMenu.title}
                                </Link>
                              ) : (
                                <>
                                  {/* Dropdown Submenu */}
                                  <div
                                    className="sidebar-title"
                                    style={{
                                      marginLeft: "15px",
                                      fontSize: "13px",
                                    }}
                                    onClick={() =>
                                      setOpenSubMenu(
                                        isSubExpanded ? null : subKey,
                                      )
                                    }
                                  >
                                    <span>{subMenu.title}</span>

                                    <span>{isSubExpanded ? "▼" : "▶"}</span>
                                  </div>

                                  {isSubExpanded && (
                                    <div
                                      style={{
                                        marginLeft: "20px",
                                      }}
                                    >
                                      {subMenu.links?.map((link) => (
                                        <Link
                                          key={link.path}
                                          to={link.path}
                                          className={
                                            location.pathname === link.path
                                              ? "active"
                                              : ""
                                          }
                                        >
                                          {link.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
