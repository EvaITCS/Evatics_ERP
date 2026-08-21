import React, {
    useEffect,
    useState
} from "react";

import holidayService
from "../services/holidayService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/employee.css";
function EmployeeHolidaysPage() {

    const [holidays,
        setHolidays] = useState([]);

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

    return (

        <div className="employee-holidays-page">

            <div className="page-header">

              <PageTitle
    title="Company Holiday"
/>

            </div>

            <table
                className="employee-table"
            >

                <thead>

                    <tr>

                        <th>
                            Holiday Name
                        </th>

                        <th>
                            Holiday Date
                        </th>

                        <th>
                            Holiday Type
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        holidays.length === 0

                            ? (

                                <tr>

                                    <td
                                        colSpan="3"
                                    >

                                        No Holidays Found

                                    </td>

                                </tr>

                            )

                            : (

                                holidays.map(
                                    (holiday) => (

                                        <tr
                                            key={
                                                holiday.holidayId
                                            }
                                        >

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

                                        </tr>
                                    )
                                )
                            )
                    }

                </tbody>

            </table>

        </div>
    );
}

export default EmployeeHolidaysPage;