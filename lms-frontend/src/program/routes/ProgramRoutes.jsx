import {
    Routes,
    Route
} from "react-router-dom";

import ProgramListPage
    from "../pages/ProgramListPage";

import CreateProgramPage
    from "../pages/CreateProgramPage";





export default function ProgramRoutes() {

    return (

        <Routes>

            <Route
                path="/"
                element={<ProgramListPage />}
            />

            <Route
                path="/create"
                element={<CreateProgramPage />}
            />

            <Route
    path="/edit/:programId"
    element={<CreateProgramPage />}
/>

       

          

        </Routes>
    );
}