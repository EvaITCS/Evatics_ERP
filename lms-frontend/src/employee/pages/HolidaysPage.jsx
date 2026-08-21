import React, {
    useEffect,
    useState
} from "react";

import holidayService
from "../services/holidayService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/employee.css";
function HolidaysPage() {

    const [holidays,
        setHolidays] = useState([]);

    const [editingId,
        setEditingId] = useState(null);

    const [formData,
        setFormData] = useState({

            holidayName: "",
            holidayDate: "",
            holidayType: ""
        });

    useEffect(() => {

        fetchHolidays();

    }, []);

    const fetchHolidays = async () => {

        try {

            const response =
                await holidayService
                    .getAllHolidays();

            setHolidays(
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

                await holidayService
                    .updateHoliday(
                        editingId,
                        formData
                    );

                alert(
                    "Holiday Updated Successfully"
                );

            } else {

                await holidayService
                    .createHoliday(
                        formData
                    );

                alert(
                    "Holiday Added Successfully"
                );
            }

            setEditingId(null);

            setFormData({

                holidayName: "",
                holidayDate: "",
                holidayType: ""
            });

            fetchHolidays();

        } catch (error) {

            console.error(error);
        }
    };

    const handleEdit = (holiday) => {

        setEditingId(
            holiday.holidayId
        );

        setFormData({

            holidayName:
                holiday.holidayName,

            holidayDate:
                holiday.holidayDate,

            holidayType:
                holiday.holidayType
        });
    };

    const handleDelete = async (
        holidayId
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this holiday?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await holidayService
                .deleteHoliday(
                    holidayId
                );

            alert(
                "Holiday Deleted Successfully"
            );

            fetchHolidays();

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="holidays-page">

            <div className="page-header">

            <PageTitle
    title="Holiday Calendar"
/>
            </div>

            <form
                className="master-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    name="holidayName"
                    placeholder="Holiday Name"
                    value={formData.holidayName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="holidayDate"
                    value={formData.holidayDate}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="holidayType"
                    placeholder="Holiday Type"
                    value={formData.holidayType}
                    onChange={handleChange}
                    required
                />

                <button type="submit">

                    {
                        editingId

                            ? "Update Holiday"

                            : "Add Holiday"
                    }

                </button>

            </form>

            <table
                className="employee-table"
            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>
                            Holiday Name
                        </th>

                        <th>
                            Holiday Date
                        </th>

                        <th>
                            Holiday Type
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        holidays.map(
                            (holiday) => (

                                <tr
                                    key={
                                        holiday.holidayId
                                    }
                                >

                                    <td>
                                        {
                                            holiday.holidayId
                                        }
                                    </td>

                                    <td>
                                        {
                                            holiday.holidayName
                                        }
                                    </td>

                                    <td>
                                        {
                                            holiday.holidayDate
                                        }
                                    </td>

                                    <td>
                                        {
                                            holiday.holidayType
                                        }
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    holiday
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    holiday.holidayId
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            )
                        )
                    }

                </tbody>

            </table>

        </div>
    );
}

export default HolidaysPage;