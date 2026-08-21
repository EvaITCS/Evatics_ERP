import React, { useEffect, useState } from "react";
import studentService from "../services/studentService";
import StudentLayout from "../layouts/StudentLayout";
import "../styles/curriculum.css";

export default function CurriculumPage() {
  const [data, setData] = useState(null);
  

  useEffect(() => {
    const email = localStorage.getItem("email");
    studentService
      .getDashboard(email)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Curriculum layout error:", err));
  }, []);

  return (
    <StudentLayout student={data || {}}>
     
        {/* --- RHYTHM SECTION --- */}
        <div className="rhythm-box">
          <h2 style={{ marginTop: 0, }}>Your Day, By Design</h2>
          <p style={{fontSize:15}}>Every day of all nine weeks follows the same rhythm — the way real Agile engineering teams work. New concepts land in the morning while attention is freshest; afternoons are for building.</p>
          <div className="rhythm-grid">
           <div className="rhythm-row blue">

    <div className="rhythm-time">
        9:30 –<br/>9:45
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Daily Stand-up · Jira Board
        </div>

        <div className="rhythm-desc">
            What's done, what's next, blockers — the real Agile habit, from Day 1.
        </div>

    </div>

</div>
            <div className="rhythm-row green">

    <div className="rhythm-time">
        9:45 –<br />11:00
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Session 1 — Concept (Trainer-Led)
        </div>

        <div className="rhythm-desc">
            New theory and topics, taught fresh — never right after lunch.
        </div>

    </div>

</div>
            <div className="rhythm-row gray">

    <div className="rhythm-time">
        11:00 –<br />11:15
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Short Break
        </div>

        <div className="rhythm-desc">
            Mental reset — no screens.
        </div>

    </div>

</div>
           <div className="rhythm-row orange">

    <div className="rhythm-time">
        11:15 –<br />12:45
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Session 2 — Live Coding &amp; Demo
        </div>

        <div className="rhythm-desc">
            Your trainer builds it live; you code along.
        </div>

    </div>

</div>
           <div className="rhythm-row gray">

    <div className="rhythm-time">
        12:45 –<br />1:30
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Lunch
        </div>

        <div className="rhythm-desc">
            A full 45-minute reset before the self-driven afternoon.
        </div>

    </div>

</div>
           <div className="rhythm-row purple">

    <div className="rhythm-time">
        1:30 –<br />3:00
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Session 3 — Hands-on Lab · Capstone Build
        </div>

        <div className="rhythm-desc">
            Independent and paired work on your SecureBank module tasks.
        </div>

    </div>

</div>
            <div className="rhythm-row gray">

    <div className="rhythm-time">
        3:00 –<br />3:10
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Short Break
        </div>

        <div className="rhythm-desc">
            Quick stretch — your afternoon focus depends on it.
        </div>

    </div>

</div>
           <div className="rhythm-row blue">

    <div className="rhythm-time">
        3:10 –<br />4:20
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Session 4 — Guided Practice · Pair Programming
        </div>

        <div className="rhythm-desc">
            Trainer circulates, debugs with you, and pairs teammates to learn from each other.
        </div>

    </div>

</div>
           <div className="rhythm-row gray">

    <div className="rhythm-time">
        4:20 –<br />4:30
    </div>

    <div className="rhythm-bar"></div>

    <div className="rhythm-content">

        <div className="rhythm-title">
            Wrap-up &amp; Jira Board Update
        </div>

        <div className="rhythm-desc">
            Close the loop — move your cards, log blockers for tomorrow.
        </div>

    </div>

</div>
         
        </div>


<div className="highlight-grid">

    <div className="highlight-card">

        <div className="highlight-title">
            🧠 Concepts while you're freshest
        </div>

        <p>
            New material is always taught 9:45–11:00 —
            attention research says mornings win, so
            that's when theory happens.
        </p>

    </div>

    <div className="highlight-card">

        <div className="highlight-title">
            🔁 Agile bookends
        </div>

        <p>
            Stand-up to open, board update to close.
            By Week 9, sprint ceremonies are second
            nature — not an interview talking point
            you memorized.
        </p>

    </div>

    <div className="highlight-card">

        <div className="highlight-title">
            🏁 Fridays end with a demo
        </div>

        <p>
            Every week closes with a Sprint Review,
            Retrospective, and a live demo of what you
            built. You will never end a week with only
            "content covered."
        </p>

    </div>

    <div className="highlight-card">

        <div className="highlight-title">
            🎤 Interview prep, every Friday from Week 4
        </div>

        <p>
            A standing 30-minute Friday clinic —
            communication drills, technical Q&A, and
            mock-interview practice — so interview
            readiness is built over six weeks, not
            crammed at the end.
        </p>

    </div>

</div>

       <div className="capstone-section">

    <h2 className="capstone-heading">
        The SecureBank Capstone — Your Portfolio, Built Weekly
    </h2>

    <p className="capstone-subtitle">
        You don't build the capstone at the end. You build it <em>the whole time</em> — nine modules, each one shipped and demoed before the next begins.
    </p>

    <div className="capstone-grid">

        <div className="module-card blue">
            <div className="module-label">MODULE 0 · WK 1–2</div>
            <h3>Foundation</h3>
            <p>ER diagram, schema, seed data, SQL statement demo</p>
        </div>

        <div className="module-card orange">
            <div className="module-label">MODULE 1 · WK 2–3</div>
            <h3>Customer Portal UI</h3>
            <p>Wireframes → static pages → React with state &amp; tests</p>
        </div>

        <div className="module-card red">
            <div className="module-label">MODULE 2 · WK 4–5</div>
            <h3>Spring Boot Backend</h3>
            <p>Entities, CRUD APIs, JWT auth — frontend wired to a real backend</p>
        </div>

        <div className="module-card teal">
            <div className="module-label">MODULE 3 · WK 6</div>
            <h3>Microservices Transformation</h3>
            <p>Eureka, Gateway, Kafka events, Redis, tracing</p>
        </div>

        <div className="module-card blue2">
            <div className="module-label">MODULE 4 · WK 7</div>
            <h3>Cloud Deployment</h3>
            <p>Docker, Terraform, AWS ECS, Kubernetes</p>
        </div>

        <div className="module-card purple">
            <div className="module-label">MODULE 5 · WK 8</div>
            <h3>CI/CD &amp; Monitoring</h3>
            <p>Jenkins, GitHub Actions, Prometheus, Grafana, ELK</p>
        </div>

        <div className="module-card magenta">
            <div className="module-label">MODULE 6 · WK 8</div>
            <h3>AI-Powered Features</h3>
            <p>Spring AI, RAG assistant, MCP tool-calling, guardrails</p>
        </div>

        <div className="module-card gold">
            <div className="module-label">MODULE 7 · WK 9</div>
            <h3>Scale, Harden &amp; Review</h3>
            <p>Load testing, OWASP audit, high-availability redesign</p>
        </div>

        <div className="module-card gold">
            <div className="module-label">MODULE 8 · WK 9</div>
            <h3>Final Integration &amp; Demo Day</h3>
            <p>End-to-end testing, docs, live demo, certification</p>
        </div>

    </div>

</div>

      </div>
    </StudentLayout>
  );
}