import { useEffect, useState } from "react";
import StudentLayout from "../layouts/StudentLayout";
import studentService from "../services/studentService";
import StudentSupportCard from "../components/StudentSupportCard";

export default function StudentSupportPage() {
    const [student, setStudent] = useState({});

    useEffect(() => {
        const email = localStorage.getItem("email");

        studentService
            .getDashboard(email)
            .then((res) => setStudent(res.data));
    }, []);

    return (
        <StudentLayout student={student}>
            <StudentSupportCard />
        </StudentLayout>
    );
}