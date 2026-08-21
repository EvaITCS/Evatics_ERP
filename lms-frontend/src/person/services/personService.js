import api from "../../api/axios";

const checkEmail = (email) => {

    return api.get(
        `/api/persons/check-email?email=${email}`
    );

};

export default {

    checkEmail

};