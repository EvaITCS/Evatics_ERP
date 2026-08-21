import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/dashboard.css";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboardStats();
      console.log("DASHBOARD RESPONSE =", data);
      setStats(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================
  if (loading) {
    return (
        <div className="dashboard-state">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================
  if (error) {
    return (
        <div className="dashboard-state error">
          <h2>{error}</h2>
          <button type="button" onClick={fetchDashboard}>
            Retry
          </button>
        </div>
    );
  }

  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================
  if (role === "ADMIN") {
    return (
        <div className="dashboard-page">


          {/* LEAD MANAGEMENT */}
          <section className="dashboard-section">
            <h2 className="summary-heading">LEAD MANAGEMENT</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card total-leads">
                <h3>Total Leads</h3>
                <p className="stat-value">{stats?.totalLeads ?? 0}</p>
              </div>

              <div className="dashboard-card new-leads">
                <h3>New Leads</h3>
                <p className="stat-value">{stats?.newLeads ?? 0}</p>
              </div>

              <div className="dashboard-card interested-leads">
                <h3>Interested Leads</h3>
                <p className="stat-value">{stats?.interestedLeads ?? 0}</p>
              </div>

              <div className="dashboard-card callback-leads">
                <h3>Callback Leads</h3>
                <p className="stat-value">{stats?.callbackLeads ?? 0}</p>
              </div>

              <div className="dashboard-card converted-leads">
                <h3>Converted Leads</h3>
                <p className="stat-value">{stats?.convertedLeads ?? 0}</p>
              </div>
            </div>
          </section>

          {/* EMPLOYEE MANAGEMENT */}
          <section className="dashboard-section">
            <h2 className="summary-heading">EMPLOYEE MANAGEMENT</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card total-emp">
                <h3>Total Employees</h3>
                <p className="stat-value">{stats?.totalEmployees ?? 0}</p>
              </div>

              <div className="dashboard-card active-emp">
                <h3>Active Employees</h3>
                <p className="stat-value">{stats?.activeEmployees ?? 0}</p>
              </div>

              <div className="dashboard-card inactive-emp">
                <h3>Inactive Employees</h3>
                <p className="stat-value">{stats?.inactiveEmployees ?? 0}</p>
              </div>

              <div className="dashboard-card departments">
                <h3>Departments</h3>
                <p className="stat-value">{stats?.totalDepartments ?? 0}</p>
              </div>

              <div className="dashboard-card designations">
                <h3>Designations</h3>
                <p className="stat-value">{stats?.totalDesignations ?? 0}</p>
              </div>
            </div>
          </section>
        </div>
    );
  }

  // =====================================================
  // COUNSELLOR DASHBOARD
  // =====================================================
  return (
      <div className="dashboard-page">


        {/* LEAD MANAGEMENT */}
        <section className="dashboard-section">
          <h2 className="summary-heading">LEAD MANAGEMENT</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card total-leads">
              <h3>Total Leads</h3>
              <p className="stat-value">{stats?.totalLeads ?? 0}</p>
            </div>

            <div className="dashboard-card new-leads">
              <h3>New Leads</h3>
              <p className="stat-value">{stats?.newLeads ?? 0}</p>
            </div>

            <div className="dashboard-card interested-leads">
              <h3>Interested Leads</h3>
              <p className="stat-value">{stats?.interestedLeads ?? 0}</p>
            </div>

            <div className="dashboard-card callback-leads">
              <h3>Callback Leads</h3>
              <p className="stat-value">{stats?.callbackLeads ?? 0}</p>
            </div>

            <div className="dashboard-card converted-leads">
              <h3>Converted Leads</h3>
              <p className="stat-value">{stats?.convertedLeads ?? 0}</p>
            </div>
          </div>
        </section>

        {/* FOLLOWUPS */}
        <section className="dashboard-section">
          <h2 className="summary-heading">FOLLOWUPS</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card today-followups">
              <h3>Today's Followups</h3>
              <p className="stat-value">{stats?.followupsToday ?? 0}</p>
            </div>

            <div className="dashboard-card pending-followups">
              <h3>Incomplete Followups</h3>
              <p className="stat-value">{stats?.pendingFollowups ?? 0}</p>
            </div>
          </div>
        </section>

        {/* COMMUNICATION ACTIVITY */}
        <section className="dashboard-section">
          <h2 className="summary-heading">COMMUNICATION ACTIVITY</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card total-calls">
              <h3>Total Calls</h3>
              <p className="stat-value">{stats?.totalCalls ?? 0}</p>
            </div>

            <div className="dashboard-card total-emails">
              <h3>Total Emails</h3>
              <p className="stat-value">{stats?.totalEmails ?? 0}</p>
            </div>

            <div className="dashboard-card total-sms">
              <h3>Total SMS</h3>
              <p className="stat-value">{stats?.totalSms ?? 0}</p>
            </div>

            <div className="dashboard-card emails-sent">
              <h3>Emails Sent</h3>
              <p className="stat-value">{stats?.emailsSent ?? 0}</p>
            </div>
          </div>
        </section>
      </div>
  );
}

export default DashboardPage;