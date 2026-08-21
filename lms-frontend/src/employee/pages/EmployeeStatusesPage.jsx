import React, {
    useEffect,
    useState
} from "react";

import employeeStatusService
from "../services/employeeStatusService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/employee.css";
function EmployeeStatusesPage() {

    const [statuses,
        setStatuses] = useState([]);

    const [editingId,
        setEditingId] = useState(null);

    const [formData,
        setFormData] = useState({

            statusName: ""
        });

    useEffect(() => {

        fetchStatuses();

    }, []);

    const fetchStatuses =
        async () => {

            try {

                const response =
                    await employeeStatusService
                        .getAllEmployeeStatuses();

                setStatuses(
                    response.data
                );

            } catch (error) {

                console.error(error);
            }
        };

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await employeeStatusService
                    .updateEmployeeStatus(
                        editingId,
                        formData
                    );

                alert(
                    "Employee Status Updated Successfully"
                );

            } else {

                await employeeStatusService
                    .createEmployeeStatus(
                        formData
                    );

                alert(
                    "Employee Status Created Successfully"
                );
            }

            setFormData({

                statusName: ""
            });

            setEditingId(null);

            fetchStatuses();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data ||
                "Operation Failed"
            );
        }
    };

    const handleDelete = async (
        employeeStatusId
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this status?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await employeeStatusService
                .deleteEmployeeStatus(
                    employeeStatusId
                );

            alert(
                "Employee Status Deleted Successfully"
            );

            fetchStatuses();

        } catch (error) {

            console.error(error);
        }
    };

    const handleEdit = (
        status
    ) => {

        setEditingId(
            status.employeeStatusId
        );

        setFormData({

            statusName:
                status.statusName
        });
    };

    const handleView = (
        status
    ) => {

        alert(

            `Employee Status ID: ${status.employeeStatusId}

Status Name: ${status.statusName}`
        );
    };

    return (

        <div className="employee-status-page">

            <div className="page-header">

               <PageTitle
    title="Employee Statuses"
/>

            </div>

            <form
                className="master-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    name="statusName"
                    placeholder="Status Name"
                    value={
                        formData.statusName
                    }
                    onChange={handleChange}
                    required
                />

                <button type="submit">

                    {
                        editingId

                            ? "Update Status"

                            : "Add Status"
                    }

                </button>

            </form>

            <table
                className="employee-table"
            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Status Name</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        statuses.length === 0

                            ? (

                                <tr>

                                    <td
                                        colSpan="3"
                                    >

                                        No Employee Status Found

                                    </td>

                                </tr>

                            )

                            : (

                                statuses.map(

                                    (
                                        status
                                    ) => (

                                        <tr
                                            key={
                                                status.employeeStatusId
                                            }
                                        >

                                            <td>
                                                {
                                                    status.employeeStatusId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    status.statusName
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    onClick={() =>
                                                        handleView(
                                                            status
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                {" "}

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            status
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {" "}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            status.employeeStatusId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )
                            )
                    }

                </tbody>

            </table>

        </div>
    );
}

export default EmployeeStatusesPage;