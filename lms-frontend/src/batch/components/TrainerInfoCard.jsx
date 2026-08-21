// src/batch/components/TrainerInfoCard.jsx

export default function TrainerInfoCard({
    trainer
}) {

    if (!trainer) {

        return <p>No Trainer Assigned</p>;
    }

    return (

        <div>

            <h2>Trainer Info</h2>

            <p>
                {trainer.name}
            </p>

            <p>
                {trainer.email}
            </p>

        </div>
    );
}