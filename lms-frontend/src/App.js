import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./shared/components/ToastContext";

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;