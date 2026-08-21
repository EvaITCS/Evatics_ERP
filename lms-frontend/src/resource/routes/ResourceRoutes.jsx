import { Route } from "react-router-dom";

import IndustryCapstonePage from "../pages/IndustryCapstonePage";
import ResumeGeneratorPage from "../pages/ResumeGeneratorPage";

const ResourceRoutes = (
    <>
        <Route
            path="industry-capstone"
            element={<IndustryCapstonePage />}
        />

        <Route
            path="resume-generator"
            element={<ResumeGeneratorPage />}
        />
    </>
);

export default ResourceRoutes;