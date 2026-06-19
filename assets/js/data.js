/* ARK-OS — content data
   All real content extracted from the original portfolio. Single source of truth. */

const ARK = {
  profile: {
    name: "Alok Roy Karmakar",
    handle: "ARK",
    role: "Agentic AI Developer · Data Scientist · ML Engineer",
    tagline: "Open to Remote AI Roles Globally",
    location: "Cooch Behar, West Bengal, India",
    email: "royalokkarmakar@outlook.in",
    phone: "+91-7865997629",
    linkedin: "https://www.linkedin.com/in/alokroykarmakar1994",
    github: "https://www.github.com/royalokkarmakar1994",
    summary:
      "6+ years turning complex data into business impact — at TCS, Tata Steel, and HDFC. Now building autonomous AI agents, LLM pipelines, and GenAI systems at IIT Roorkee i-Hub. My edge: deep domain expertise in procurement & finance combined with cutting-edge AI engineering.",
  },

  stats: [
    { num: 25, suffix: "%", label: "Efficiency Gain", icon: "📈" },
    { num: 15, suffix: "%", label: "Cost Reduction", icon: "💰" },
    { num: 6, suffix: "+", label: "Years Experience", icon: "🧠" },
    { num: 20, suffix: "%", label: "Ops Improvement", icon: "🎯" },
  ],

  about: {
    paragraphs: [
      "My journey is unconventional — and that's the point. I started as a <strong>Data Analyst at TCS</strong>, spent years deep in SAP systems and supply chain optimization, then moved to <strong>Tata Steel</strong> as a Procurement Manager where I led AI-driven cost reduction initiatives and built IoT monitoring systems.",
      "At <strong>HDFC Life</strong>, I pivoted into financial analytics, building ML-powered forecasting models that improved accuracy by <strong>25%</strong>. Today, I'm channeling all of that domain expertise into <strong>Agentic AI development</strong> at IIT Roorkee i-Hub — building autonomous agents that actually understand the business context they operate in.",
      "Most AI engineers lack deep business knowledge. I bring both. That's my unfair advantage — and why I build AI systems that are <strong>technically robust and commercially impactful</strong>.",
    ],
    tags: [
      { t: "Agentic AI", c: "blue" },
      { t: "LLM Pipelines", c: "blue" },
      { t: "GenAI", c: "blue" },
      { t: "Prompt Engineering", c: "purple" },
      { t: "Deep Learning", c: "purple" },
      { t: "NLP", c: "purple" },
      { t: "Procurement Automation", c: "teal" },
      { t: "Supply Chain AI", c: "teal" },
      { t: "Financial Modeling", c: "teal" },
    ],
    languages: [
      { name: "English", level: "Professional" },
      { name: "Bengali", level: "Native" },
      { name: "Hindi", level: "Proficient" },
    ],
    seeking:
      "AI Engineer · Agentic AI Developer · Data Scientist · ML Engineer — Remote roles globally",
  },

  skills: [
    {
      title: "Agentic AI & GenAI",
      icon: "🤖",
      items: ["LLM Pipelines", "Autonomous Agents", "Prompt Engineering", "Agentic Systems", "Tool Use / Function Calling", "RAG"],
    },
    {
      title: "Machine Learning",
      icon: "🧠",
      items: ["Predictive Modeling", "Deep Learning", "NLP", "Data Pipelines", "Model Evaluation"],
    },
    {
      title: "AI Trading & Finance",
      icon: "📊",
      items: ["EMA / VWAP", "RSI / MACD", "Greeks", "Intraday Strategy", "Options Modeling"],
    },
    {
      title: "Data Science & Tools",
      icon: "🐍",
      items: ["Python", "SQL", "Advanced Excel", "Data Visualization", "Business Analytics", "Dashboards"],
    },
    {
      title: "Enterprise & Domain",
      icon: "🏭",
      items: ["SAP (Inventory & Procurement)", "IoT Integration", "Supply Chain Optimization", "Vendor Management"],
    },
  ],

  experience: [
    {
      role: "Agentic AI & System Design Trainee",
      company: "IIT Roorkee i-Hub Foundation × Masai School",
      period: "Jan 2026 — Jul 2026",
      location: "Delhi, India (Remote-capable)",
      accent: "blue",
      bullets: [
        "Specializing in Agentic AI and System Design — building <strong>autonomous AI agents</strong> with tool use, memory, and multi-step reasoning",
        "Designing LLM-based pipelines and real-world agentic applications for procurement, finance, and operations",
        "Applying AI/ML to solve complex business problems with measurable ROI",
      ],
      tags: ["Agentic AI", "LLM Pipelines", "System Design", "GenAI Apps"],
    },
    {
      role: "Financial Data Analyst",
      company: "HDFC Life",
      period: "Aug 2024 — Nov 2025",
      location: "Cooch Behar",
      accent: "purple",
      bullets: [
        "Improved forecasting accuracy by <strong>25%</strong> using advanced Excel and ML techniques on complex financial datasets",
        "Built comprehensive dashboards contributing to <strong>15% cost reduction</strong> in operational spending",
        "Implemented financial models improving project evaluation efficiency by <strong>30%</strong>",
        "Applied data-driven insights to optimize portfolio performance and strategic business growth",
      ],
      tags: ["+25% Forecast Accuracy", "-15% Cost", "ML Modeling", "Dashboards"],
    },
    {
      role: "Procurement Manager & Analytics Lead",
      company: "Tata Steel India",
      period: "May 2021 — Jun 2024",
      location: "Kolkata",
      accent: "teal",
      bullets: [
        "Optimized steel production processes using advanced analytics delivering <strong>25% efficiency improvement</strong>",
        "Led AI-driven procurement strategies reducing operational costs by <strong>15%</strong> through vendor negotiations",
        "Implemented real-time <strong>IoT monitoring systems</strong> reducing equipment downtime by 15%",
        "Built SAP-based inventory management system enhancing order accuracy by <strong>25%</strong>",
      ],
      tags: ["+25% Efficiency", "IoT Systems", "SAP", "Procurement AI"],
    },
    {
      role: "Data Analyst",
      company: "Tata Consultancy Services (TCS)",
      period: "Oct 2018 — Apr 2021",
      location: "Kolkata",
      accent: "gray",
      bullets: [
        "Applied advanced analytics to optimize supply chain processes, resulting in <strong>20% increase in operational efficiency</strong>",
        "Automated data workflows and built reporting dashboards with SAP system integration",
        "Supported procurement data analysis driving improved project outcomes and cost visibility",
      ],
      tags: ["+20% Ops Efficiency", "Supply Chain", "SAP", "Automation"],
    },
  ],

  projects: [
    {
      name: "Autonomous AI Agent Systems",
      icon: "🤖",
      desc: "Building autonomous AI agents using LLM frameworks for business process automation. Implementing agentic pipelines with tool use, persistent memory, and multi-step reasoning for procurement and finance use cases.",
      tech: ["LangChain", "OpenAI API", "Python", "Tool Use"],
    },
    {
      name: "AI Trading & Predictive Systems",
      icon: "📈",
      desc: "Designed system-driven trading strategies using AI indicators (EMA, VWAP, RSI, MACD, Greeks). Built predictive models for intraday and options trading with measurable accuracy improvements.",
      tech: ["Python", "ML Models", "MACD/RSI", "Backtesting"],
    },
    {
      name: "Procurement Intelligence Automation",
      icon: "🏭",
      desc: "Applied ML techniques to automate procurement decisions, vendor scoring, and supply chain forecasting. Integrated IoT data with analytics platforms for real-time operational monitoring at Tata Steel.",
      tech: ["SAP", "IoT", "ML", "Python", "Analytics"],
    },
  ],

  education: [
    { degree: "Agentic AI & System Design", school: "IIT Roorkee i-Hub × Masai School", year: "2026 — Present · Professional Certification", status: "current" },
    { degree: "Master of Computer Applications (MCA)", school: "Amity University Online", year: "2025 — 2027 · Computer Science", status: "ongoing" },
    { degree: "PG in Banking & Finance", school: "Manipal University, Bangalore", year: "2024 — 2025", status: "done" },
    { degree: "Bachelor of Science (B.Sc.)", school: "University of North Bengal, Siliguri", year: "2012 — 2016 · Biology & General Sciences", status: "done" },
  ],

  certifications: [
    { name: "Agentic AI & System Design", issuer: "IIT Roorkee i-Hub / Masai School", year: "2026" },
    { name: "Artificial Intelligence", issuer: "Corizo", year: "Dec 2025" },
    { name: "Google Startup School: Prompt to Prototype", issuer: "Google", year: "Dec 2025" },
    { name: "SEBI Investor Certification Examination", issuer: "SEBI / NISM", year: "Oct 2024" },
    { name: "Banking & Finance", issuer: "Manipal University", year: "Jan 2024" },
  ],
};

// expose for plugin app files loaded in separate <script> tags
window.ARK = ARK;
