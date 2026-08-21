// useEmployees.js

import { useEffect, useState } from "react";

import employeeService
from "../services/employeeService";

function useEmployees() {

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {

        fetchEmployees();

    }, []);

    const fetchEmployees = async () => {

        try {

            setLoading(true);

            const response =
                await employeeService
                    .getAllEmployees();

            setEmployees(response.data);

        } catch (err) {

            setError(err);

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    const deleteEmployee = async (employeeId) => {

        try {

            await employeeService
                .deleteEmployee(employeeId);

            fetchEmployees();

        } catch (err) {

            console.error(err);
        }
    };

    return {

        employees,
        loading,
        error,
        fetchEmployees,
        deleteEmployee
    };
}

export default useEmployees;