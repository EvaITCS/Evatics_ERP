import React, {
    useEffect,
    useState
} from "react";

import LocationForm
from "../components/LocationForm";

import locationService
from "../services/locationService";
import PageTitle from "../../shared/components/PageTitle";
import { useToast } from "../../shared/components/ToastContext";
import "../styles/employee.css";
function LocationsPage() {
    const { showToast } = useToast();
    const [locations, setLocations] = useState([]);

    const [editingId, setEditingId] =
        useState(null);

    const [formData, setFormData] =
        useState({

            locationName: "",
            address: ""
        });

    useEffect(() => {

        fetchLocations();

    }, []);

    const fetchLocations = async () => {

        try {

            const response =
                await locationService
                    .getAllLocations();

            setLocations(
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

                await locationService
                    .updateLocation(
                        editingId,
                        formData
                    );

                showToast(
                    "Location Updated Successfully",
                    "success"
                );

            } else {

                await locationService
                    .createLocation(
                        formData
                    );

                showToast(
                    "Location Added Successfully",
                    "success"
                );
            }

            setEditingId(null);

            setFormData({

                locationName: "",
                address: ""
            });

            fetchLocations();

        } catch (error) {

            console.error(error);
        }
    };

    const handleEdit = (location) => {

        setEditingId(
            location.locationId
        );

        setFormData({

            locationName:
                location.locationName,

            address:
                location.address
        });
    };

    const handleDelete = async (
        locationId
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this location?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await locationService
                .deleteLocation(
                    locationId
                );

            showToast(
                "Location Deleted Successfully",
                "success"
            );

            fetchLocations();

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="locations-page">

            <div className="page-header">
<PageTitle
    title="Locations"
/>

            </div>

            <LocationForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            <table className="employee-table">

                <thead>

                    <tr>

                        <th>
                            Location Name
                        </th>

                        <th>
                            Address
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        locations.map(
                            (location) => (

                                <tr
                                    key={
                                        location.locationId
                                    }
                                >

                                    <td>
                                        {
                                            location.locationName
                                        }
                                    </td>

                                    <td>
                                        {
                                            location.address
                                        }
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    location
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    location.locationId
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

export default LocationsPage;