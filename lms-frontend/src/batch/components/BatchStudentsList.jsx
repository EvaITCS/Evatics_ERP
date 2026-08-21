// src/batch/components/BatchStudentsList.jsx

export default function BatchStudentsList({
    students
}) {

    return (

        <div>

            <h2>Students</h2>

            {
                students?.map(student => (

                    <div key={student.studentId}>

                        <p>
                            {student.studentName}
                        </p>

                    </div>
                ))
            }

        </div>
    );
}