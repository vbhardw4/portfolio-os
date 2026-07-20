/**
 * SITE_CONFIG — single source of truth for all portfolio content.
 *
 * Everything the desktop OS experience and the mobile plain page render
 * comes from this object.
 */
const SITE_CONFIG = {
  name: "Vishal Bhardwaj",
  shortName: "Vishal",
  role: "Senior Backend Engineer — Java / Spring Boot",
  tagline:
    "I design and ship production Java/Spring Boot microservices and Kafka-driven event pipelines for capital markets and enterprise platforms — 10+ years backend, currently at Citibank.",
  location: "Toronto, Ontario, Canada",
  availability: "Open to Senior Backend Engineer roles — Java, Spring Boot, Kafka, distributed systems",

  email: "vishalbhardwaj630@gmail.com",
  github: "https://github.com/vbhardw4",
  linkedin: "https://www.linkedin.com/in/vishal-bhardwaj630/",
  resumeUrl: "assets/resume.pdf",

  bio: [
    "10+ years building backend systems across capital markets, insurance, retail, and telecom — currently a Senior Software Engineer at Citibank designing Spring Boot microservices, gRPC-based event collection, and real-time monitoring platforms for production support teams. Master of Software Engineering, University of Western Ontario.",
    "Outside of work I build AI-native products end to end — an autonomous personal agent (Aria) and a multi-tenant SaaS (ReviewDrop) — because I'd rather ship something real than just read about the tools. Looking for backend-focused teams working in Java/Spring Boot and event-driven architecture who want someone who can design the system and carry it to production."
  ],

  skills: [
    { label: "Java / Spring Boot microservices", level: 92 },
    { label: "Kafka & event-driven architecture", level: 88 },
    { label: "GCP / AWS, Docker, Kubernetes", level: 82 },
    { label: "Postgres / MongoDB / Redis / Elasticsearch", level: 85 },
    { label: "AI / LLM integration (Claude API, agentic tooling)", level: 88 }
  ],

  projects: [
    {
      id: "reviewdrop",
      title: "ReviewDrop",
      problem:
        "Local shops lose repeat business because happy customers rarely leave a Google review unprompted, and the ones who try often abandon the flow.",
      role: "Sole engineer — designed and built the full product, backend to deploy.",
      approach:
        "Node/Express API with multi-tenant Postgres, Redis-backed suggestion pools using stale-while-revalidate rotation so shops always see fresh AI-drafted review prompts, Cloudflare CDN in front, and per-plan feature gating for billing tiers. Claude API drafts a contextual review suggestion the instant a customer taps a star rating — no app install required.",
      outcome:
        "Confetti-based gamified rating UX renders at 60fps on mid-range Android — the whole flow from QR tap to posted review runs in under 30 seconds.",
      techStack: ["Node.js", "Express", "PostgreSQL", "Redis", "Cloudflare", "Claude API", "React"],
      liveUrl: "",
      githubUrl: "https://github.com/vbhardw4/reviewdrop"
    },
    {
      id: "aria",
      title: "Aria — Personal AI Automation Agent",
      problem:
        "Email triage, job-lead tracking, and daily prioritization were eating an hour a day of manual attention that should have been automatable.",
      role: "Sole builder — architecture, agent orchestration, and memory design.",
      approach:
        "Built on the Hermes agent framework with persistent memory and multi-agent orchestration. An Obsidian vault acts as a structured long-term memory layer; the agent classifies and prioritizes incoming email, surfaces relevant job leads, and delivers a unified morning digest over Telegram — plus a self-improvement loop where the agent updates its own profile and skills based on interaction history.",
      outcome:
        "Runs autonomously in production for daily email triage and briefings — no manual intervention required.",
      techStack: ["Hermes Agent", "Claude API", "Google Workspace API", "Telegram Bot API", "Obsidian", "Python"],
      liveUrl: "",
      githubUrl: "https://github.com/vbhardw4/aria-agentic"
    }
  ],

  experience: [
    {
      company: "Citibank",
      title: "Senior Software Engineer",
      dates: "Sep 2023 – Present",
      highlights: [
        "Designed and led a production monitoring service consolidating business process health (PNL workflow status, intraday recon breaks, position breaks, NPV/PV breaks, Flash PNL, EOD reconciliation) into a real-time ITRS dashboard.",
        "Architected gRPC-based event collection from 10+ downstream microservices with direct ELK Stack/Elasticsearch integration.",
        "Architected a high-performance microservices risk management platform (Spring Boot, reactive programming, gRPC).",
        "Built a real-time FX trading data ingestion pipeline (JSON streams → PNL/NPV/PAA metrics).",
        "Used Kafka (KAAS) for event-driven streaming and MongoDB for unstructured data, with audit-grade schemas for compliance traceability.",
        "Championed AI coding assistant adoption (Claude Code, Devin, GitHub Copilot); drove 90%+ JUnit coverage.",
        "Mentored engineers and presented system designs to senior management."
      ]
    },
    {
      company: "Loblaws Companies Limited",
      title: "Senior Software Engineer",
      dates: "Mar 2022 – Sep 2023",
      highlights: [
        "Deployed cloud-native ETL pipelines on GCP (GKE, BigQuery, Cloud Composer, Apache Airflow, Cloud Storage); owned pipeline deployments and orchestration at enterprise scale.",
        "Built a Pub/Sub event-driven architecture with Cloud Functions; integrated Datastore as a NoSQL backend for analytics.",
        "Delivered a React-based internal automation tool eliminating manual pipeline provisioning."
      ]
    },
    {
      company: "Canada Life",
      title: "Senior Software Developer",
      dates: "Jul 2020 – Mar 2022",
      highlights: [
        "Delivered core modules across Policy Management, Profile Management, and Claims Processing on a Spring/Hybris Java platform.",
        "Integrated Kafka with Kerberos auth for secure underwriting data ingestion; used Hibernate for ORM and transaction integrity.",
        "Built full-stack features with Vue.js, Angular, and JSP on a Spring backend; configured Splunk dashboards and cron alerting.",
        "Led code reviews, mentored developers, and collaborated with Business Analysts."
      ]
    },
    {
      company: "Amdocs Development Center India",
      title: "Software Developer",
      dates: "Jul 2016 – Jul 2019",
      highlights: [
        "Built Order Management and CPQ features (Spring Boot, Kafka, Zookeeper, Couchbase, React-Redux) with 90%+ JUnit coverage.",
        "Reduced system response time by 40% through targeted API call elimination and refactoring.",
        "Developed and consumed RESTful and SOAP APIs; built greenfield microservices.",
        "Handled critical post-production issues during major releases on-site in Guadalajara, Mexico."
      ]
    }
  ],

  education: [
    {
      school: "University of Western Ontario",
      credential: "Master of Software Engineering",
      dates: "Sep 2019 – Aug 2020",
      details: "Cloud Computing, Machine Learning, Web Technologies"
    },
    {
      school: "Guru Nanak Dev University, India",
      credential: "B.Tech in Computer Science",
      dates: "Jul 2012 – May 2016",
      details: "CGPA 8.02/10"
    }
  ],

  certifications: [
    "GCP Associate Cloud Engineer",
    "GCP Professional Data Engineer"
  ]
};
