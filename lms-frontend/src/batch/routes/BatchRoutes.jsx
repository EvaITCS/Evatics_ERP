// src/batch/routes/BatchRoutes.jsx

import { Routes, Route } from "react-router-dom";

import BatchListPage from "../pages/BatchListPage";
import CreateBatchPage from "../pages/CreateBatchPage";


import BatchDetailsPage from "../pages/BatchDetailsPage";
import EditBatchPage from "../pages/EditBatchPage";


export default function BatchRoutes() {

    return (
        <Routes>

           
            <Route
                path="/list"
                element={<BatchListPage />}
            />

            <Route
                path="/create"
                element={<CreateBatchPage />}
            />


           

            <Route
    path="details/:batchId"
    element={<BatchDetailsPage />}
/>


<Route
    path="/edit/:batchId"
    element={<EditBatchPage />}
/>


        </Routes>

        
    );
}