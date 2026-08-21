// src/batch/hooks/useBatchDetails.js

import { useEffect, useState } from "react";

import {
    getBatchDetails
} from "../services/batchService";

export default function useBatchDetails(
    batchId
) {

    const [batch, setBatch] = useState(null);

    useEffect(() => {

        loadBatch();

    }, [batchId]);

    const loadBatch = async () => {

        try {

            const data =
                await getBatchDetails(batchId);

            setBatch(data);

        } catch (error) {

            console.log(error);
        }
    };

    return {
        batch
    };
}