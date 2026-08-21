import StudentSidebar from "../components/StudentSidebar";
import StudentNavbar from "../components/StudentNavbar";

export default function StudentLayout({ student, children }) {

    // Format personId as application/enrollment number (e.g. 1 -> APP00001)
     const formatApplicationNumber = personId => {
        if (!personId) return "";
        return `APP${personId}`;
    };

    const applicationNumber = formatApplicationNumber(student.personId);

    return (
        <div className="student-layout">

          
            <StudentSidebar type={student.dashboardType} />

    
            <div className="student-main">

    
                <StudentNavbar
                    name={student.name}
                    type={student.dashboardType}
                    applicationNo={
                        student.dashboardType === "BASIC"
                            ? applicationNumber
                            : `ENR${applicationNumber.replace("APP", "")}`
                    }
                    programName={student.program}
                />

                {children}

            </div>

        </div>
    );
}