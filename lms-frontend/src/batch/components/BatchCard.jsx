
import "../styles/batchCard.css";

export default function BatchCard({ batch }) {

    return (

        <div className="batch-card">

            <h3>{batch.batchCode}</h3>

            <p>
                Program :
                {batch.programName}
            </p>

            <p>
                Trainer :
                {batch.trainerName}
            </p>

            <p>
                Students :
                {batch.currentStrength}
            </p>

        </div>
    );
}