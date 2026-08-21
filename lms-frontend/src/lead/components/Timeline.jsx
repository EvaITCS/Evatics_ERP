import "../../shared/styles/sidebar.css";

function Timeline({ events = [] }) {

  // =====================================
  // EMPTY
  // =====================================

  if (!events || events.length === 0) {
    return (
        <div className="empty-timeline">
          <p>No Timeline Events</p>
        </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
      <div className="timeline">
        {events.map((event, index) => (
            <div
                key={`${event.title || "event"}-${event.date || index}`}
                className="timeline-item"
            >
              {/* ===================================== */}
              {/* HEADER */}
              {/* ===================================== */}

              <div className="timeline-header">
                <strong>{event.title || "Lead Activity"}</strong>

                <span>
              {event.date &&
              !isNaN(new Date(event.date).getTime())
                  ? new Date(event.date).toLocaleString()
                  : "-"}
            </span>
              </div>

              {/* ===================================== */}
              {/* MESSAGE */}
              {/* ===================================== */}

              <p>{event.message || "No Activity Details"}</p>

              {/* ===================================== */}
              {/* STATUS */}
              {/* ===================================== */}

              {event.status && (
                  <div className="timeline-status">
                    {event.status}
                  </div>
              )}

              {/* ===================================== */}
              {/* COUNSELLOR */}
              {/* ===================================== */}

              {event.COUNSELLOR && (
                  <small>
                    COUNSELLOR: {event.COUNSELLOR}
                  </small>
              )}
            </div>
        ))}
      </div>
  );
}

export default Timeline;