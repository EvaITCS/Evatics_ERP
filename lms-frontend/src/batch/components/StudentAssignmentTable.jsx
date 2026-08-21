// src/batch/components/StudentAssignmentTable.jsx

export default function StudentAssignmentTable({
    students
}) {

    return (

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Name</th>

                </tr>

            </thead>

            <tbody>

                {
                    students.map(student => (

                        <tr key={student.studentId}>

                            <td>
                                {student.studentId}
                            </td>

                            <td>
                                {student.studentName}
                            </td>

                        </tr>
                    ))
                }

            </tbody>

        </table>
    );
}