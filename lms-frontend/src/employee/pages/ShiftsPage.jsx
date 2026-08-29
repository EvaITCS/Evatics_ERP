import React, {
    useEffect,
    useState
} from "react";
import { useToast } from "../../shared/components/ToastContext";
import ShiftForm from "../components/ShiftForm";
import shiftService from "../services/shiftService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/employee.css";
function ShiftsPage() {
    const { showToast } = useToast();
    const [shifts, setShifts] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        shiftName: "",
        startTime: "",
        endTime: "",
        isActive: true
    });

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {

        try {

            const response =
                await shiftService.getAllShifts();

            setShifts(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await shiftService.updateShift(
                    editingId,
                    formData
                );

                showToast(
                    "Shift Updated Successfully",
                    "success"
                );

            } else {

                await shiftService.createShift(
                    formData
                );

                showToast(
                    "Shift Added Successfully",
                    "success"
                );
            }

            setEditingId(null);

            setFormData({
                shiftName: "",
                startTime: "",
                endTime: "",
                isActive: true
            });

            fetchShifts();

        } catch (error) {

            console.error(error);
        }
    };

    const handleEdit = (shift) => {

        setEditingId(
            shift.shiftId
        );

        setFormData({
            shiftName: shift.shiftName,
            startTime: shift.startTime,
            endTime: shift.endTime,
            isActive: shift.isActive
        });
    };

    const handleDelete = async (
        shiftId
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this shift?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await shiftService.deleteShift(
                shiftId
            );

            showToast(
                "Shift Deleted Successfully",
                "success"
            );

            fetchShifts();

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="shifts-page">

            <div className="page-header">
                <PageTitle
    title="Shift Management"
/>
            </div>

            <ShiftForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            <table className="employee-table">

                <thead>

                    <tr>

                        <th>Shift Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        shifts.map((shift) => (

                            <tr key={shift.shiftId}>

                                <td>
                                    {shift.shiftName}
                                </td>

                                <td>
                                    {shift.startTime}
                                </td>

                                <td>
                                    {shift.endTime}
                                </td>

                                <td>
                                    {
                                        shift.isActive
                                            ? "Active"
                                            : "Inactive"
                                    }
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                shift
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                shift.shiftId
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))
                    }

                </tbody>

            </table>

        </div>
    );
}

export default ShiftsPage;