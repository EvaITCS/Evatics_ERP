// EmployeesPage.jsx

import React, {
    useEffect,
    useState
} from "react";

import EmployeeTable
from "../components/EmployeeTable";

import EmployeeFilters
from "../components/EmployeeFilters";

import EmployeeDetailsModal
from "../components/EmployeeDetailsModal";
import { useToast } from "../../shared/components/ToastContext";
import employeeService
from "../services/employeeService";

import departmentService
from "../services/departmentService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/employee.css";
function EmployeesPage() {

    const [employees, setEmployees] = useState([]);
    const { showToast } = useToast();
    const [filteredEmployees,
        setFilteredEmployees] = useState([]);

    const [departments,
        setDepartments] = useState([]);

    const [search, setSearch] = useState("");

    const [departmentFilter,
        setDepartmentFilter] = useState("");

    const [selectedEmployee,
        setSelectedEmployee] = useState(null);

    useEffect(() => {

        fetchEmployees();
        fetchDepartments();

    }, []);

    useEffect(() => {

        filterEmployees();

    }, [search, departmentFilter, employees]);

    const fetchEmployees = async () => {

        try {

            const response =
                await employeeService.getAllEmployees();

            setEmployees(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const fetchDepartments = async () => {

        try {

            const response =
                await departmentService.getAllDepartments();

            setDepartments(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const filterEmployees = () => {

        let data = [...employees];

        if (search) {

            data = data.filter((employee) =>
                employee.fullName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (departmentFilter) {

            data = data.filter(
                (employee) =>
                    String(employee.departmentId)
                    === String(departmentFilter)
            );
        }

        setFilteredEmployees(data);
    };

    const handleView = (employee) => {

        setSelectedEmployee(employee);
    };

    const handleEdit = (employee) => {

        window.location.href =
            `/employees/update/${employee.employeeId}`;
    };

    return (

        <div className="employees-page">

            <div className="page-header">

                <h2>Employees</h2>

                <button
                    className="add-btn"
                    onClick={() =>
                        window.location.href =
                        "/employees/add"
                    }
                >
                    Add Employee
                </button>

            </div>

            <EmployeeFilters
                search={search}
                setSearch={setSearch}
                departmentFilter={departmentFilter}
                setDepartmentFilter={
                    setDepartmentFilter
                }
                departments={departments}
            />

            <EmployeeTable
                employees={filteredEmployees}
                onView={handleView}
                onEdit={handleEdit}
            />

            <EmployeeDetailsModal
                employee={selectedEmployee}
                onClose={() =>
                    setSelectedEmployee(null)
                }
            />

        </div>
    );
}

export default EmployeesPage;