export default function ErrorState({
  message = "Something went wrong"
}) {
  return (
    <div className="error-state">
      <h2>Error</h2>
      <p>{message}</p>
    </div>
  );
}