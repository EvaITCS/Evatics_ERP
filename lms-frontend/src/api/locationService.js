import api from "./axios";

export const searchLocation = async (text) => {
    const response = await api.get(
        "/api/locations/search",
        {
            params: {
                text: text
            }
        }
    );

    return response.data;
};