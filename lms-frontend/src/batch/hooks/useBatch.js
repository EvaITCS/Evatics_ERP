// src/batch/hooks/useBatch.js

import { useEffect, useState } from "react";
import {
    getAllBatches
} from "../services/batchService";

export default function useBatch() {

    const [batches, setBatches] = useState([]);

    const [loading, setLoading] = useState(false);

    const loadBatches = async () => {

        try {

            setLoading(true);

            const data = await getAllBatches();

            setBatches(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        loadBatches();

    }, []);

    return {
        batches,
        loading,
        loadBatches
    };
}