import React, {
    useEffect,
    useState
} from "react";

import designationService
from "../services/designationService";

import roleService
from "../services/roleService";

import PageTitle
from "../../shared/components/PageTitle";
import "../styles/employee.css";

function DesignationsPage() {

    const [designations,
        setDesignations] =
        useState([]);

    const [roles,
        setRoles] =
        useState([]);

    const [editingId,
        setEditingId] =
        useState(null);

    const [formData,
        setFormData] =
        useState({

            designationName: "",

            designationLevel: "",

            roleId: ""
        });

    useEffect(() => {

        fetchDesignations();

        fetchRoles();

    }, []);

    const fetchDesignations =
        async () => {

            try {

                const response =
                    await designationService
                        .getAllDesignations();

                setDesignations(
                    response.data
                );

            } catch (error) {

                console.error(error);
            }
        };

    const fetchRoles =
        async () => {

            try {

                const response =
                    await roleService
                        .getAllRoles();

                setRoles(
                    response.data
                );

            } catch (error) {

                console.error(error);
            }
        };

    const handleChange =
        (e) => {

            setFormData({

                ...formData,

                [e.target.name]:
                    e.target.value
            });
        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                if (editingId) {

                    await designationService
                        .updateDesignation(
                            editingId,
                            formData
                        );

                    alert(
                        "Designation Updated Successfully"
                    );

                } else {

                    await designationService
                        .createDesignation(
                            formData
                        );

                    alert(
                        "Designation Created Successfully"
                    );
                }

                setFormData({

                    designationName: "",

                    designationLevel: "",

                    roleId: ""
                });

                setEditingId(null);

                fetchDesignations();

            } catch (error) {

                console.error(error);

                alert(
                    "Operation Failed"
                );
            }
        };

    const handleDelete =
        async (
            designationId
        ) => {

            const confirmDelete =
                window.confirm(
                    "Delete this designation?"
                );

            if (!confirmDelete) {
                return;
            }

            try {

                await designationService
                    .deleteDesignation(
                        designationId
                    );

                alert(
                    "Designation Deleted Successfully"
                );

                fetchDesignations();

            } catch (error) {

                console.error(error);

                alert(
                    "Failed To Delete Designation"
                );
            }
        };

    const handleEdit =
        (
            designation
        ) => {

            setEditingId(
                designation.designationId
            );

            setFormData({

                designationName:
                    designation.designationName,

                designationLevel:
                    designation.designationLevel || "",

                roleId:
                    designation.roleId || ""
            });
        };

    const handleView =
        (
            designation
        ) => {

            alert(

                `Designation ID: ${designation.designationId}

Designation Name: ${designation.designationName}

Designation Level: ${designation.designationLevel || "N/A"}

Role: ${designation.roleName || "N/A"}`
            );
        };

    return (

        <div className="designations-page">

            <div className="page-header">

                <PageTitle
                    title="Designations"
                />

            </div>

            <form
                className="master-form"
                onSubmit={
                    handleSubmit
                }
            >

                <input
                    type="text"
                    name="designationName"
                    placeholder="Designation Name"
                    value={
                        formData.designationName
                    }
                    onChange={
                        handleChange
                    }
                    required
                />

                <input
                    type="text"
                    name="designationLevel"
                    placeholder="Designation Level"
                    value={
                        formData.designationLevel
                    }
                    onChange={
                        handleChange
                    }
                />

                <select
                    name="roleId"
                    value={
                        formData.roleId
                    }
                    onChange={
                        handleChange
                    }
                    required
                >

                    <option value="">
                        Select Role
                    </option>

                    {
                        roles.map(
                            (role) => (

                                <option
                                    key={
                                        role.roleId
                                    }
                                    value={
                                        role.roleId
                                    }
                                >
                                    {
                                        role.roleName
                                    }
                                </option>
                            )
                        )
                    }

                </select>

                <button
                    type="submit"
                >

                    {
                        editingId
                            ? "Update Designation"
                            : "Add Designation"
                    }

                </button>

            </form>

            <table className="employee-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>
                            Designation Name
                        </th>

                        <th>
                            Designation Level
                        </th>

                        <th>
                            Role
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        designations.length === 0

                            ? (

                                <tr>

                                    <td colSpan="5">

                                        No Designations Found

                                    </td>

                                </tr>

                            )

                            : (

                                designations.map(

                                    (
                                        designation
                                    ) => (

                                        <tr
                                            key={
                                                designation.designationId
                                            }
                                        >

                                            <td>
                                                {
                                                    designation.designationId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    designation.designationName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    designation.designationLevel
                                                }
                                            </td>

                                            <td>
                                                {
                                                    designation.roleName
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    onClick={() =>
                                                        handleView(
                                                            designation
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                {" "}

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            designation
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {" "}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            designation.designationId
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

export default DesignationsPage;