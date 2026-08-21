export default function BatchForm({

    form,
    handleChange,
    handleSubmit

}) {

    return (

        <form onSubmit={handleSubmit}>

            <input
                type="text"
                name="batchCode"
                placeholder="Batch Code"
                value={form.batchCode}
                onChange={handleChange}
            />

            <input
                type="number"
                name="trainerId"
                placeholder="Trainer ID"
                value={form.trainerId}
                onChange={handleChange}
            />

            <input
                type="number"
                name="programId"
                placeholder="Program ID"
                value={form.programId}
                onChange={handleChange}
            />

            <button type="submit">
                Save Batch
            </button>

        </form>
    );
}