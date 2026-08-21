// locationService.js
import api from "../../api/axios";

const BASE_URL = "/api/locations";

const getAllLocations = () => {

    return api.get(
        BASE_URL
    );
};

const getLocationById = (locationId) => {

    return api.get(
        `${BASE_URL}/${locationId}`
    );
};

const createLocation = (locationData) => {

    return api.post(
        BASE_URL,
        locationData
    );
};

const updateLocation = (
    locationId,
    locationData
) => {

    return api.put(
        `${BASE_URL}/${locationId}`,
        locationData
    );
};

const deleteLocation = (locationId) => {

    return api.delete(
        `${BASE_URL}/${locationId}`
    );
};

const locationService = {

    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
};

export default locationService;