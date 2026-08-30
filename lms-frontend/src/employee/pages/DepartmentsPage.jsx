import React, {
    useEffect,
    useState
} from "react";

import departmentService
from "../services/departmentService";
import PageTitle from "../../shared/components/PageTitle";
import { useToast } from "../../shared/components/ToastContext";
import "../styles/employee.css";
function DepartmentsPage() {
    const { showToast } = useToast();
    const [departments,
        setDepartments] = useState([]);

    const [editingId,
        setEditingId] = useState(null);

    const [formData,
        setFormData] = useState({

            departmentName: "",
            description: ""
        });

    useEffect(() => {

        fetchDepartments();

    }, []);

    const fetchDepartments =
        async () => {

            try {

                const response =
                    await departmentService
                        .getAllDepartments();

                setDepartments(
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

                await departmentService
                    .updateDepartment(
                        editingId,
                        formData
                    );

                showToast(
                    "Department Updated Successfully",
                    "success"
                );

            } else {

                await departmentService
                    .createDepartment(
                        formData
                    );

                showToast(
                    "Department Created Successfully",
                    "success"
                );
            }

            setFormData({

                departmentName: "",
                description: ""
            });

            setEditingId(null);

            fetchDepartments();

        } catch (error) {

            console.error(error);

            showToast(
                error.response?.data ||
                "Operation Failed",
                "error"
            );
        }
    };

    const handleDelete = async (
        departmentId
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this department?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await departmentService
                .deleteDepartment(
                    departmentId
                );

            showToast(
                "Department Deleted Successfully",
                "success"
            );

            fetchDepartments();

        } catch (error) {

            console.error(error);

            showToast(
                "Failed To Delete Department",
                "error"
            );
        }
    };

    const handleEdit = (
        department
    ) => {

        setEditingId(
            department.departmentId
        );

        setFormData({

            departmentName:
                department.departmentName,

            description:
                department.description || ""
        });
    };

    const handleView = (
        department
    ) => {

        showToast(
            `Department ID: ${department.departmentId}

Department Name: ${department.departmentName}

Description: ${department.description || "N/A"}`,
            "info"
        );
    };

    return (

        <div className="departments-page">

            <div className="page-header">

                <PageTitle
    title="Departments"
/>

            </div>

            {/* FORM */}

            <form
                className="master-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    name="departmentName"
                    placeholder="Department Name"
                    value={
                        formData.departmentName
                    }
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={
                        formData.description
                    }
                    onChange={handleChange}
                />

                <button type="submit">

                    {
                        editingId

                            ? "Update Department"

                            : "Add Department"
                    }

                </button>

            </form>

            {/* TABLE */}

            <table
                className="employee-table"
            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>
                            Department Name
                        </th>

                        <th>
                            Description
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        departments.length === 0

                            ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                    >

                                        No Departments Found

                                    </td>

                                </tr>

                            )

                            : (

                                departments.map(

                                    (
                                        department
                                    ) => (

                                        <tr
                                            key={
                                                department.departmentId
                                            }
                                        >

                                            <td>
                                                {
                                                    department.departmentId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    department.departmentName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    department.description
                                                }
                                            </td>

                                            <td>



                                                {" "}

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            department
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {" "}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            department.departmentId
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

export default DepartmentsPage;