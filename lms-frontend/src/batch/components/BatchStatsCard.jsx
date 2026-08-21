export default function BatchStatsCard({
    title,
    value
}) {

    return (
        <div className="batch-stats-card">

            <h3>{title}</h3>

            <p>{value}</p>

        </div>
    );
}