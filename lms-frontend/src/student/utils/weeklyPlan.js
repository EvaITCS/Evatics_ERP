// src/student/utils/weeklyPlan.js

export const WEEKLY_PLAN = [
  {
    week: 1,
    badge: "WEEK 1",
    phase: "ORIENTATION + PHASE 1",
    title: "Software Engineering Fundamentals",
    goal: "🎯 By Friday: you'll be working out of a Jira board, using Git daily, and kicking off SecureBank's database design.",
    milestone: null,
    days: [
      {
        day: "Mon",
        morning: "Program kickoff. Agile & Scrum foundations — values, roles, ceremonies, artifacts, Scrum vs Kanban. Jira hands-on: project setup, epics & stories.",
        afternoon: "Dev environment setup, Git basics, first Jira board populated with the program backlog."
      },
      {
        day: "Tue",
        morning: "Computer architecture, operating systems, internet fundamentals, Linux & shell, SDLC, DevOps overview.",
        afternoon: "Shell scripting exercises; Git workflow practice (branches, commits, PRs)."
      },
      {
        day: "Wed",
        morning: "Programming logic: variables, data types, operators, loops, functions.",
        afternoon: "Daily coding practice begins — and continues every day of the program."
      },
      {
        day: "Thu",
        morning: "Arrays, strings, recursion.",
        afternoon: "Coding katas; Big-O & algorithmic complexity basics."
      },
      {
        day: "Fri",
        morning: "Searching & sorting algorithms; Big-O wrap-up. SQL kickoff: database design & ER diagrams.",
        afternoon: "Sprint Review & Retro. Module 0 kickoff: SecureBank requirements → user stories in Jira; begin the ER diagram (Customer, Account, Transaction, Branch, Loan)."
      }
    ]
  },
  {
    week: 2,
    badge: "WEEK 2",
    phase: "PHASE 1 → PHASE 2",
    title: "SQL Depth → Frontend Begins",
    goal: "🎯 By Friday: SecureBank's database is live with real queries — and its first pages exist on screen.",
    milestone: null,
    days: [
      {
        day: "Mon",
        morning: "SQL: relationships & joins.",
        afternoon: "Write DDL scripts to create the SecureBank schema in PostgreSQL."
      },
      {
        day: "Tue",
        morning: "SQL: aggregation & stored procedures.",
        afternoon: "Load seed data; joins & aggregation practice; stored procedure for interest calculation."
      },
      {
        day: "Wed",
        morning: "SQL: indexing, transactions, views. Mini project: Student Management Database.",
        afternoon: "Module 0 demo: generate an account statement using SQL alone. Module 0 closes. ✅"
      },
      {
        day: "Thu",
        morning: "HTML5: semantic HTML, forms, tables, accessibility.",
        afternoon: "Module 1 kickoff: wireframes + UI kit setup (Tailwind / Bootstrap)."
      },
      {
        day: "Fri",
        morning: "CSS3: Flexbox, Grid, responsive design, animations, Bootstrap, Tailwind.",
        afternoon: "Sprint Review & Retro. Build the Login & Registration pages."
      }
    ]
  },
  {
    week: 3,
    badge: "WEEK 3",
    phase: "PHASE 2",
    title: "JavaScript, TypeScript & React",
    goal: "🎯 By Friday: the Customer Portal runs in React with state management, validation, and unit tests.",
    milestone: "Frontend Checkpoint",
    days: [
      {
        day: "Mon",
        morning: "JavaScript ES6+: variables, functions, objects, arrays.",
        afternoon: "Build the Customer Dashboard (static)."
      },
      {
        day: "Tue",
        morning: "JavaScript: DOM, async, Fetch API, Promises, modules.",
        afternoon: "Build the Account Statement & Transaction History page (static)."
      },
      {
        day: "Wed",
        morning: "TypeScript: types, interfaces, classes, generics.",
        afternoon: "Convert the static pages into React components."
      },
      {
        day: "Thu",
        morning: "React: components, props, state, hooks, routing, forms.",
        afternoon: "Add Redux Toolkit / Context state with mock data; form validation for login & fund transfer."
      },
      {
        day: "Fri",
        morning: "Redux Toolkit deep dive, Context API, API integration; Jest & React Testing Library.",
        afternoon: "Sprint Review, Retro & Demo: wire Fetch calls to placeholder endpoints; write frontend unit tests. Module 1 closes. ✅"
      }
    ]
  },
  {
    week: 4,
    badge: "WEEK 4",
    phase: "PHASE 3 · PART A",
    title: "Core & Advanced Java, Design Quality",
    goal: "🎯 By Friday: you're writing clean, tested, SOLID Java — and the Spring Boot backend project exists.",
    milestone: null,
    days: [
      {
        day: "Mon",
        morning: "Core Java: OOP, Collections, Streams.",
        afternoon: "Core Java coding katas."
      },
      {
        day: "Tue",
        morning: "Exception handling, multithreading, file handling, generics, functional programming.",
        afternoon: "Katas; sketch SecureBank entity classes (Customer, Account, Transaction) ahead of Module 2."
      },
      {
        day: "Wed",
        morning: "Advanced Java: JDBC, Maven, Gradle, logging.",
        afternoon: "JUnit & Mockito basics — first test suite on a utility class."
      },
      {
        day: "Thu",
        morning: "SOLID principles, common design patterns, code-review practices.",
        afternoon: "Refactor a sample codebase applying SOLID; peer code-review exercise."
      },
      {
        day: "Fri",
        morning: "Spring Core & Spring Boot introduction.",
        afternoon: "Sprint Review & Retro. Module 2 kickoff: Spring Boot layered-architecture project; begin JPA / Hibernate entity modeling.",
        interview: "Kickoff clinic: telling your story — introduce yourself as an engineer; explain your Week 1–4 journey."
      }
    ]
  },

  {
    week: 5,
    badge: "WEEK 5",
    phase: "PHASE 3 • PART B",
    title: "Spring, Security & REST",
    goal: "🎯 By Friday: full-stack SecureBank v1 is live — real backend, real auth, real data, no mocks.",
    milestone: "Backend Checkpoint",
    days: [
      {
        day: "Mon",
        morning: "Spring MVC, Spring Data JPA, Hibernate, validation.",
        afternoon: "Build CRUD REST APIs for customer & account management."
      },
      {
        day: "Tue",
        morning: "Spring Data JPA patterns; transactional service design.",
        afternoon: "Build the fund-transfer API with business rules; centralized exception handling & validation."
      },
      {
        day: "Wed",
        morning: "Spring Security, JWT, OAuth2, role-based access control, OWASP Top 10.",
        afternoon: "Add JWT authentication and RBAC (Customer vs Admin / Teller)."
      },
      {
        day: "Thu",
        morning: "REST standards, OpenAPI, Swagger, Postman.",
        afternoon: "Document the API with Swagger; unit tests with JUnit & Mockito."
      },
      {
        day: "Fri",
        morning: "Code-review clinic — SOLID refactor pass on the SecureBank backend.",
        afternoon: "Sprint Review, Retro & Demo: connect the React frontend to the real backend. Module 2 closes — SecureBank v1 is live. ✅",
        interview: "Explain your backend: walk through your CRUD + JWT design aloud, interview-style."
      }
    ]
  },
  {
    week: 6,
    badge: "WEEK 6",
    phase: "PHASE 4",
    title: "Enterprise Architecture — Microservices",
    goal: "🎯 By Friday: SecureBank runs as traced, resilient microservices with event-driven messaging.",
    milestone: null,
    days: [
      {
        day: "Mon",
        morning: "Microservices concepts: service discovery, API Gateway, config server.",
        afternoon: "Decompose the monolith (Account, Transaction, Notification, Customer services); set up Eureka."
      },
      {
        day: "Tue",
        morning: "Load balancing, circuit breakers, resilience patterns; distributed tracing overview.",
        afternoon: "API Gateway routing + centralized config server; add Resilience4j circuit breakers."
      },
      {
        day: "Wed",
        morning: "Messaging: Apache Kafka, RabbitMQ.",
        afternoon: "Integrate Kafka for transaction events & async notifications."
      },
      {
        day: "Thu",
        morning: "Caching (Redis); API versioning, pagination, security.",
        afternoon: "Redis caching for balances & sessions; versioning + pagination on transaction history."
      },
      {
        day: "Fri",
        morning: "Distributed tracing hands-on (OpenTelemetry / Zipkin / Jaeger).",
        afternoon: "Sprint Review, Retro & Demo: tracing across all services; architecture walkthrough. Module 3 closes. ✅",
        interview: "Architecture talk: describe your microservices decomposition the way you would to an interview panel."
      }
    ]
  },
  {
    week: 7,
    badge: "WEEK 7",
    phase: "PHASE 5",
    title: "Cloud Engineering",
    goal: "🎯 By Friday: SecureBank is containerized, provisioned as code, and deployed to AWS with monitoring.",
    milestone: "Deployment Checkpoint",
    days: [
      {
        day: "Mon",
        morning: "AWS fundamentals: IAM, EC2, RDS, S3, CloudWatch.",
        afternoon: "Dockerize each SecureBank microservice."
      },
      {
        day: "Tue",
        morning: "Docker: images, containers, Docker Compose.",
        afternoon: "Run the full platform locally with Docker Compose."
      },
      {
        day: "Wed",
        morning: "Terraform — provisioning AWS resources as code.",
        afternoon: "Push images to ECR; provision VPC, RDS & IAM with Terraform."
      },
      {
        day: "Thu",
        morning: "AWS Lambda, Elastic Beanstalk, ECS.",
        afternoon: "Deploy the platform to ECS or Elastic Beanstalk."
      },
      {
        day: "Fri",
        morning: "Kubernetes: pods, services, deployments, ConfigMaps, secrets.",
        afternoon: "Sprint Review, Retro & Demo: K8s manifests, deploy to EKS / local cluster, CloudWatch monitoring. Module 4 closes. ✅",
        interview: "Cloud & deployment Q&A drills: Docker, Terraform and Kubernetes questions."
      }
    ]
  },
  {
    week: 8,
    badge: "WEEK 8",
    phase: "PHASE 6 + PHASE 7",
    title: "DevOps (Mon–Tue) + AI Software Development (Wed–Fri)",
    goal: "🎯 By Friday: every commit flows through an automated pipeline — and SecureBank has working AI features.",
    milestone: null,
    days: [
      {
        day: "Mon",
        morning: "Git branching & PR workflow. CI/CD with Jenkins.",
        afternoon: "Team branching workflow; Jenkins pipeline (build → test → deploy)."
      },
      {
        day: "Tue",
        morning: "GitHub Actions. Monitoring: Prometheus, Grafana, ELK Stack.",
        afternoon: "GitHub Actions workflow with a testing gate; Prometheus metrics, Grafana dashboards, ELK logs & alerting. Module 5 closes. ✅"
      },
      {
        day: "Wed",
        morning: "AI fundamentals: LLMs, prompt engineering, AI ethics, AI in enterprise software.",
        afternoon: "Prompt-engineering exercises against a live LLM API."
      },
      {
        day: "Thu",
        morning: "Spring AI, LangChain4j, OpenAI / Claude APIs, MCP, RAG, Vector Databases, Embeddings, Agentic Patterns.",
        afternoon: "Build a customer FAQ chatbot; begin a RAG assistant grounded in bank policy documents."
      },
      {
        day: "Fri",
        morning: "AI coding tools: GitHub Copilot, Cursor, Windsurf.",
        afternoon: "Sprint Review, Retro & Demo: fraud-alert assistant, AI transaction categorization, MCP tool-calling, guardrail testing. Module 6 closes. ✅",
        interview: "CI/CD + AI feature storytelling; rapid-fire technical Q&A."
      }
    ]
  },
  {
    week: 9,
    badge: "WEEK 9",
    phase: "PHASE 8 + PHASE 9",
    title: "System Design + Enterprise Capstone Finale",
    goal: "🎯 By Friday: you demo a hardened, documented, cloud-deployed banking platform to a live panel — and earn certification.",
    milestone: null,
    days: [
      {
        day: "Mon",
        morning: "System design: scalability, high availability, load balancers, caching, sharding, event-driven systems, CAP theorem. Case studies: Netflix, Uber, Amazon, Banking Systems.",
        afternoon: "Load-test SecureBank (JMeter / Gatling); apply caching & sharding strategy."
      },
      {
        day: "Tue",
        morning: "Security-audit clinic against the OWASP Top 10 checklist.",
        afternoon: "High-availability redesign (Multi-AZ, failover); write the architecture retrospective. Module 7 closes. ✅"
      },
      {
        day: "Wed",
        morning: "Final integration planning — test strategy for the full platform.",
        afternoon: "End-to-end regression testing; performance tuning under realistic load."
      },
      {
        day: "Thu",
        morning: "Documentation standards; resume & GitHub portfolio clinic.",
        afternoon: "Close the final Jira sprint with a retrospective; README, architecture diagrams, handover docs."
      },
      {
        day: "Fri",
        morning: "Mock interview panel & demo rehearsal.",
        afternoon: "🎓 Final Demo Day: live demonstration of SecureBank, built module by module since Week 1. Certification. Module 8 closes. ✅",
        interview: "Final polish; panel etiquette, salary-question handling, demo-day dry run."
      }
    ]
  }
];

export const MILESTONES = [
  {
    week: "END OF WEEK 3",
    colorClass: "milestone-orange",
    title: "Frontend Checkpoint",
    description: "Build and style a React component independently from a wireframe."
  },
  {
    week: "END OF WEEK 5",
    colorClass: "milestone-green",
    title: "Backend Checkpoint",
    description: "Full CRUD + authentication + tests, unaided. Everything in Weeks 6–9 builds on this — it's the most important checkpoint of the program."
  },
  {
    week: "END OF WEEK 7",
    colorClass: "milestone-blue",
    title: "Deployment Checkpoint",
    description: "Confidently explain the full Docker → Terraform → Kubernetes deployment path you took."
  },
  {
    week: "END OF WEEK 9",
    colorClass: "milestone-gold",
    title: "Final Certification",
    description: "Live demo + mock interview panel — the moment you're certified job-ready."
  }
];