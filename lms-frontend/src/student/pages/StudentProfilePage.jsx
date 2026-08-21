import { useEffect, useState } from "react";
import studentService from "../services/studentService";
import StudentLayout from "../layouts/StudentLayout";
import StudentProfileCard from "../components/StudentProfileCard";

function StudentProfilePage() {

    const [profile, setProfile] = useState({});
    const [student, setStudent] = useState({});

    useEffect(() => {

        studentService
            .getDashboard()
            .then(res =>
                setStudent(res.data)
            )
            .catch(err =>
                console.log(
                    "Dashboard Fetch Error:",
                    err
                )
            );

        studentService
            .getProfile()
            .then(res =>
                setProfile(res.data)
            )
            .catch(err =>
                console.log(
                    "Profile Fetch Error:",
                    err
                )
            );

    }, []);

    return (

        <StudentLayout student={student}>

            <StudentProfileCard
                student={profile}
            />

        </StudentLayout>
    );
}

export default StudentProfilePage;