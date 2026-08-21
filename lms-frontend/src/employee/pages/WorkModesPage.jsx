import React, {
    useEffect,
    useState
} from "react";

import workModeService
from "../services/workModeService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/employee.css";
function WorkModesPage() {

    const [workModes,
        setWorkModes] = useState([]);

    const [editingId,
        setEditingId] = useState(null);

    const [modeName,
        setModeName] = useState("");

    useEffect(() => {

        fetchWorkModes();

    }, []);

    const fetchWorkModes = async () => {

        try {

            const response =
                await workModeService
                    .getAllWorkModes();

            setWorkModes(
                response.data
            );

        } catch (error) {

            console.error(error);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await workModeService
                    .updateWorkMode(
                        editingId,
                        {
                            modeName
                        }
                    );

                alert(
                    "Work Mode Updated Successfully"
                );

            } else {

                await workModeService
                    .createWorkMode(
                        {
                            modeName
                        }
                    );

                alert(
                    "Work Mode Added Successfully"
                );
            }

            setEditingId(null);

            setModeName("");

            fetchWorkModes();

        } catch (error) {

            console.error(error);
        }
    };

    const handleEdit = (mode) => {

        setEditingId(
            mode.modeId
        );

        setModeName(
            mode.modeName
        );
    };

    const handleDelete = async (
        modeId
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this work mode?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await workModeService
                .deleteWorkMode(
                    modeId
                );

            alert(
                "Work Mode Deleted Successfully"
            );

            fetchWorkModes();

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="work-modes-page">

            <div className="page-header">

               <PageTitle
    title="Work Modes"
/>

            </div>

            <form
                className="master-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Work Mode"
                    value={modeName}
                    onChange={(e) =>
                        setModeName(
                            e.target.value
                        )
                    }
                    required
                />

                <button type="submit">

                    {
                        editingId

                            ? "Update Work Mode"

                            : "Add Work Mode"
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
                            Work Mode
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        workModes.map(
                            (mode) => (

                                <tr
                                    key={
                                        mode.modeId
                                    }
                                >

                                    <td>
                                        {
                                            mode.modeId
                                        }
                                    </td>

                                    <td>
                                        {
                                            mode.modeName
                                        }
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    mode
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    mode.modeId
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

export default WorkModesPage;