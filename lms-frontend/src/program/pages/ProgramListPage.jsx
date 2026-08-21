import { useEffect, useState } from "react";
import ProgramTable from "../components/ProgramTable";
import { getAllPrograms , deleteProgram } from "../services/programService";
import "../styles/program.css";

export default function ProgramListPage() {
    const [allPrograms, setAllPrograms] = useState([]);      
    const [filteredPrograms, setFilteredPrograms] = useState([]); 
    const [activeFilter, setActiveFilter] = useState("ALL");  
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    
    // State to track which card is currently hovered for hover micro-interactions
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        loadPrograms();
    }, []);

    const loadPrograms = async () => {
        try {
            const res = await getAllPrograms();
            const programData = res.data || [];
            setAllPrograms(programData);
            if (activeFilter === "ACTIVE") {
    setFilteredPrograms(
        programData.filter(p => p.isActive)
    );
}
else if (activeFilter === "INACTIVE") {
    setFilteredPrograms(
        programData.filter(p => !p.isActive)
    );
}
else {
    setFilteredPrograms(programData);
}

            const activeCount = programData.filter(p => p.isActive).length;
            const inactiveCount = programData.length - activeCount;

            setStats({
                total: programData.length,
                active: activeCount,
                inactive: inactiveCount
            });
        } catch (error) {
            console.error("Error loading programs:", error);
        }
    };

const handleDeleteProgram = async (programId) => {
    try {

        await deleteProgram(programId);

        alert("Program Deactivated Successfully");

        await loadPrograms();

    } catch (error) {

        console.error(error);

        alert("Failed To Deactivate Program");
    }
};

    const handleFilterChange = (filterType) => {
        setActiveFilter(filterType);
        if (filterType === "ALL") {
            setFilteredPrograms(allPrograms);
        } else if (filterType === "ACTIVE") {
            setFilteredPrograms(allPrograms.filter(p => p.isActive));
        } else if (filterType === "INACTIVE") {
            setFilteredPrograms(allPrograms.filter(p => !p.isActive));
        }
    };

    // Shared styling configuration for metrics cards
    const getCardStyle = (cardType, activeBorderColor, activeBgColor) => {
        const isActive = activeFilter === cardType;
        const isHovered = hoveredCard === cardType;

        return {
            background: "white",
            padding: "18px 24px",
            borderRadius: "12px",
            border: isActive 
                ? `2px solid ${activeBorderColor}` 
                : (isHovered ? `1px solid ${activeBorderColor}` : "1px solid #e2e8f0"),
            flex: 1,
            boxShadow: isActive 
                ? `0 10px 20px ${activeBgColor}` 
                : (isHovered ? "0 4px 12px rgba(0,0,0,0.05)" : "0 1px 3px rgba(0,0,0,0.01)"),
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered || isActive ? "translateY(-3px)" : "none",
            position: "relative"
        };
    };

    return (
        <div className="program-layout" style={{ padding: "0px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <div className="program-main" style={{ maxWidth: "1280px", margin: "0 auto" }}>
                <div className="program-content">
                    
                    {/* HEADER AREA */}
                    <div style={{ marginBottom: "28px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
                        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                            Program Management
                        </h2>
                    
                        <p style={{ fontSize: "14px", color: "#64748b", marginTop: "10px", margin: 0,  }}>
                            Manage academic courses, track track status profiles, and execute operational deployments.
                        </p>
                    </div>

                    {/* METRICS INTERACTIVE FILTER PANEL */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
                        
                        {/* CARD 1: TOTAL PROGRAMS */}
                        <div 
                            onClick={() => handleFilterChange("ALL")}
                            onMouseEnter={() => setHoveredCard("ALL")}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={getCardStyle("ALL", "#3b82f6", "rgba(59,130,246,0.08)")}
                        >
                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Programs</span>
                            <div style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginTop: "6px" }}>{stats.total}</div>
                            <span style={{ position: "absolute", bottom: "12px", right: "16px", fontSize: "11px", color: "#3b82f6", fontWeight: "500", opacity: activeFilter === "ALL" ? 1 : 0.6 }}>
                                {activeFilter === "ALL" ? "● Active View" : "Click to view"}
                            </span>
                        </div>

                        {/* CARD 2: ACTIVE PATHS */}
                        <div 
                            onClick={() => handleFilterChange("ACTIVE")}
                            onMouseEnter={() => setHoveredCard("ACTIVE")}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={getCardStyle("ACTIVE", "#10b981", "rgba(16,185,129,0.08)")}
                        >
                            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Paths</span>
                            <div style={{ fontSize: "28px", fontWeight: "700", color: "#10b981", marginTop: "6px" }}>{stats.active}</div>
                            <span style={{ position: "absolute", bottom: "12px", right: "16px", fontSize: "11px", color: "#10b981", fontWeight: "500", opacity: activeFilter === "ACTIVE" ? 1 : 0.6 }}>
                                {activeFilter === "ACTIVE" ? "● Active View" : "Click to filter"}
                            </span>
                        </div>

                        {/* CARD 3: INACTIVE PROGRAMS */}
                        <div 
                            onClick={() => handleFilterChange("INACTIVE")}
                            onMouseEnter={() => setHoveredCard("INACTIVE")}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={getCardStyle("INACTIVE", "#ef4444", "rgba(239,68,68,0.08)")}
                        >
                            <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Inactive Programs</span>
                            <div style={{ fontSize: "28px", fontWeight: "700", color: "#ef4444", marginTop: "6px" }}>{stats.inactive}</div>
                            <span style={{ position: "absolute", bottom: "12px", right: "16px", fontSize: "11px", color: "#ef4444", fontWeight: "500", opacity: activeFilter === "INACTIVE" ? 1 : 0.6 }}>
                                {activeFilter === "INACTIVE" ? "● Active View" : "Click to filter"}
                            </span>
                        </div>
                    </div>

                    {/* REFINED ENTERPRISE TABLE HEADER */}
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        marginBottom: "14px",
                        padding: "0 4px"
                    }}>
                        <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
                            {activeFilter === "ALL" && "All Enrolled Programs"}
                            {activeFilter === "ACTIVE" && "Active Curriculums"}
                            {activeFilter === "INACTIVE" && "Archived / Inactive Curriculums"}
                        </h4>
                        <div style={{ fontSize: "13px", color: "#64748b" }}>
                            Showing <strong style={{ color: "#0f172a" }}>{filteredPrograms.length}</strong> entries
                        </div>
                    </div>

                    {/* TABLE VIEW */}
                    <div style={{ background: "white", borderRadius: "12px", overflow: "hidden" }}>
                        <ProgramTable programs={filteredPrograms}
                        onDeleteProgram={handleDeleteProgram} />
                    </div>

                </div>
            </div>
        </div>
    );
}