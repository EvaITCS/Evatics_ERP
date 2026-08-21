// src/batch/context/BatchContext.jsx

import {
    createContext,
    useState
} from "react";

export const BatchContext =
    createContext();

export default function BatchProvider({
    children
}) {

    const [selectedBatch,
        setSelectedBatch] = useState(null);

    return (

        <BatchContext.Provider
            value={{
                selectedBatch,
                setSelectedBatch
            }}
        >

            {children}

        </BatchContext.Provider>
    );
}