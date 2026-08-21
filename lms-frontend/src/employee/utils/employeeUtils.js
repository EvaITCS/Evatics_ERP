// employeeUtils.js

export const getEmployeeFullName = (
    employee
) => {

    if (!employee) {
        return "";
    }

    return `

        ${employee.firstName || ""}

        ${employee.middleName || ""}

        ${employee.lastName || ""}

    `
        .replace(/\s+/g, " ")
        .trim();
};

export const getEmployeeInitials = (
    employee
) => {

    if (!employee) {
        return "";
    }

    const first =
        employee.firstName?.charAt(0) || "";

    const last =
        employee.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase();
};

export const formatEmployeeStatus = (
    status
) => {

    if (!status) {
        return "";
    }

    return status
        .toLowerCase()
        .replace("_", " ")
        .replace(/\b\w/g,
            (char) => char.toUpperCase()
        );
};

export const calculateExperience = (
    joiningDate
) => {

    if (!joiningDate) {
        return "0 Years";
    }

    const joinDate = new Date(joiningDate);

    const currentDate = new Date();

    const years = currentDate.getFullYear()
        - joinDate.getFullYear();

    return `${years} Years`;
};

export const filterEmployees = (
    employees,
    search,
    departmentId
) => {

    let filteredEmployees = [...employees];

    if (search) {

        filteredEmployees =
            filteredEmployees.filter(
                (employee) =>

                    getEmployeeFullName(employee)
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );
    }

    if (departmentId) {

        filteredEmployees =
            filteredEmployees.filter(
                (employee) =>

                    String(employee.departmentId)
                    === String(departmentId)
            );
    }

    return filteredEmployees;
};