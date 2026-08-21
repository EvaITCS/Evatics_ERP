function ActionButton({ text, onClick }) {
    return (
        <button
            className="action-btn"
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default ActionButton;