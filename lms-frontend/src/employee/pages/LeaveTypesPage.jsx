import React, {
    useEffect,
    useState
} from "react";

import leaveTypeService
from "../services/leaveTypeService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/employee.css";
function LeaveTypesPage() {

    const [leaveTypes,
        setLeaveTypes] = useState([]);

    const [editingId,
        setEditingId] = useState(null);

    const [formData,
        setFormData] = useState({

            leaveTypeName: "",

            maxDaysAllowed: "",

            isPaid: true
        });

    useEffect(() => {

        fetchLeaveTypes();

    }, []);

    const fetchLeaveTypes =
        async () => {

            try {

                const response =
                    await leaveTypeService
                        .getAllLeaveTypes();

                setLeaveTypes(
                    response.data
                );

            } catch (error) {

                console.error(error);
            }
        };

    const handleChange =
        (e) => {

            const value =
                e.target.name === "isPaid"

                    ? e.target.value === "true"

                    : e.target.value;

            setFormData({

                ...formData,

                [e.target.name]:
                    value
            });
        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                if (editingId) {

                    await leaveTypeService
                        .updateLeaveType(

                            editingId,

                            formData
                        );

                    alert(
                        "Leave Type Updated Successfully"
                    );

                } else {

                    await leaveTypeService
                        .createLeaveType(
                            formData
                        );

                    alert(
                        "Leave Type Created Successfully"
                    );
                }

                setFormData({

                    leaveTypeName: "",

                    maxDaysAllowed: "",

                    isPaid: true
                });

                setEditingId(null);

                fetchLeaveTypes();

            } catch (error) {

                console.error(error);

                alert(
                    "Operation Failed"
                );
            }
        };

    const handleEdit =
        (leaveType) => {

            setEditingId(
                leaveType.leaveTypeId
            );

            setFormData({

                leaveTypeName:
                    leaveType.leaveTypeName,

                maxDaysAllowed:
                    leaveType.maxDaysAllowed,

                isPaid:
                    leaveType.isPaid
            });
        };

    const handleDelete =
        async (leaveTypeId) => {

            const confirmDelete =
                window.confirm(
                    "Delete this leave type?"
                );

            if (!confirmDelete)
                return;

            try {

                await leaveTypeService
                    .deleteLeaveType(
                        leaveTypeId
                    );

                alert(
                    "Leave Type Deleted Successfully"
                );

                fetchLeaveTypes();

            } catch (error) {

                console.error(error);
            }
        };

    const handleView =
        (leaveType) => {

            alert(

                "Leave Type Details\n\n" +

                "ID: " +

                leaveType.leaveTypeId +

                "\n\nName: " +

                leaveType.leaveTypeName +

                "\n\nMax Days: " +

                leaveType.maxDaysAllowed +

                "\n\nPaid Leave: " +

                (
                    leaveType.isPaid

                        ? "Yes"

                        : "No"
                )
            );
        };

    return (

        <div className="leave-types-page">

            <div className="page-header">

             <PageTitle
    title="Leave Types"
/>
            </div>

            <form
                className="master-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    name="leaveTypeName"
                    placeholder="Leave Type Name"
                    value={
                        formData.leaveTypeName
                    }
                    onChange={
                        handleChange
                    }
                    required
                />

                <input
                    type="number"
                    name="maxDaysAllowed"
                    placeholder="Max Days Allowed"
                    value={
                        formData.maxDaysAllowed
                    }
                    onChange={
                        handleChange
                    }
                    required
                />

                <select
                    name="isPaid"
                    value={
                        formData.isPaid
                    }
                    onChange={
                        handleChange
                    }
                >

                    <option value={true}>
                        Paid
                    </option>

                    <option value={false}>
                        Unpaid
                    </option>

                </select>

                <button
                    type="submit"
                >

                    {
                        editingId

                            ? "Update Leave Type"

                            : "Add Leave Type"
                    }

                </button>

                {
                    editingId && (

                        <button
                            type="button"
                            onClick={() => {

                                setEditingId(
                                    null
                                );

                                setFormData({

                                    leaveTypeName: "",

                                    maxDaysAllowed: "",

                                    isPaid: true
                                });

                            }}
                        >

                            Cancel

                        </button>
                    )
                }

            </form>

            <table
                className="employee-table"
            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>
                            Leave Type
                        </th>

                        <th>
                            Max Days
                        </th>

                        <th>
                            Paid
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        leaveTypes.length === 0

                            ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                    >

                                        No Leave Types Found

                                    </td>

                                </tr>

                            )

                            : (

                                leaveTypes.map(

                                    (
                                        leaveType
                                    ) => (

                                        <tr
                                            key={
                                                leaveType.leaveTypeId
                                            }
                                        >

                                            <td>
                                                {
                                                    leaveType.leaveTypeId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    leaveType.leaveTypeName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    leaveType.maxDaysAllowed
                                                }
                                            </td>

                                            <td>

                                                {
                                                    leaveType.isPaid

                                                        ? "Yes"

                                                        : "No"
                                                }

                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleView(
                                                            leaveType
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                {" "}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            leaveType
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {" "}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            leaveType.leaveTypeId
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

export default LeaveTypesPage;