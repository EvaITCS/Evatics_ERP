// src/batch/components/BatchInfoCard.jsx

export default function BatchInfoCard({
    batch
}) {

    return (

        <div>

            <h2>{batch.batchCode}</h2>

            <p>
                Program :
                {batch.programName}
            </p>

            <p>
                Start :
                {batch.startDate}
            </p>

            <p>
                End :
                {batch.endDate}
            </p>

        </div>
    );
}