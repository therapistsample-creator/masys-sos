export const modules = [
  [
    "Risk Register",
    "Identify, assess, rate, and treat risks - inherent and residual ratings, treatment plans, ownership, review schedule.",
  ],
  [
    "Controls Tracker",
    "Track Annex A control implementation - owner, evidence links, gap notes. Built for any standard’s control set.",
  ],
  [
    "Evidence Repository",
    "Single evidence store - upload once, link to controls and audits across any active standard.",
  ],
  [
    "Audit Management",
    "Plan audits, record findings, link nonconformities - schedule tracked, NCRs raised directly from findings.",
  ],
  [
    "Document Management",
    "Version-controlled policy and procedure records - owner, approver, review frequency, approval status.",
  ],
  [
    "Nonconformity & CAR",
    "Raise and track nonconformities and corrective actions - root cause, containment, treatment, closure verification.",
  ],
  [
    "Objectives",
    "Define management objectives and KPIs - targets, measurement frequency, quarterly actuals, owner, status.",
  ],
  [
    "Interested Parties",
    "Record stakeholders, their needs and expectations, applicable obligations, engagement method, review schedule.",
  ],
  [
    "Legal & Regulatory Obligations",
    "Track applicable laws, standards, and contracts - compliance status, applicable clauses, owner, review frequency.",
  ],
  [
    "Training Records",
    "Competence requirements, training completion, gaps, and closure plans per person and role.",
  ],
  [
    "Supplier Management",
    "Third-party due diligence, contract clause status, data flows, sub-processors, criticality, review schedule.",
  ],
  [
    "Improvement Register",
    "Continual improvement actions - source, expected benefit, priority, progress, effectiveness review.",
  ],
  [
    "Management Review",
    "Schedule and record management reviews - agenda items, decisions, action items, closure status.",
  ],
  [
    "Incident Register",
    "Incidents - detection, severity, response, regulatory notification, resolution, lessons learned.",
  ],
] as const;
export const aiModules = [
  [
    "AI System Register",
    "Full inventory of AI systems - type, lifecycle stage, risk level, owner, oversight, regulatory classification.",
  ],
  [
    "AI Impact Assessment",
    "Structured impact assessment for AI systems - scope, affected parties, controls applied, assessment outcome.",
  ],
  [
    "AI Model Version Register",
    "Model version history, training data, V&V records, deployment, explainability method, fairness baseline metrics.",
  ],
] as const;
export const standards = [
  [
    "ISO 42001:2023",
    "Artificial Intelligence Management System",
    "The international standard for governing responsible AI design, development, deployment, and use. Covers risk management, controls, accountability, transparency, and continual improvement across the AI lifecycle.",
    "Live - v1.0",
    "Clauses: 4–10 + Annex A",
    "DIY Kit: 147 documents",
  ],
  [
    "ISO 27001:2022",
    "Information Security Management System",
    "The world’s most widely adopted information security standard. Establishes a framework for managing information security risks, implementing controls, and achieving certification.",
    "Planned - v2.0",
    "Clauses: 4–10 + Annex A",
    "DIY Kit: ~87 documents",
  ],
  [
    "ISO 27701:2019",
    "Privacy Information Management System",
    "An extension to ISO 27001 addressing privacy information management. Maps directly to GDPR and other privacy frameworks, providing controls for data controllers and processors.",
    "Planned - v3.0",
    "Extension of: ISO 27001",
    "DIY Kit: ~58 documents",
  ],
  [
    "ISO 27017:2015",
    "Cloud Security Controls",
    "A code of practice for cloud service security controls, providing guidance for both cloud service providers and customers on implementing and managing security in cloud environments.",
    "Planned - v4.0",
    "Based on: ISO 27002",
    "DIY Kit: ~54 documents",
  ],
  [
    "ISO 27018:2019",
    "Cloud Privacy Controls",
    "Controls for protecting personally identifiable information in public cloud environments. Complements ISO 27017 with specific privacy obligations for cloud service providers processing personal data.",
    "Planned - v5.0",
    "Based on: ISO 27002",
    "DIY Kit: ~47 documents",
  ],
  [
    "ISO 27035:2023",
    "Information Security Incident Management",
    "Structured guidance for planning and preparing for incident response, detecting and reporting incidents, assessing response actions, and conducting post-incident reviews and improvements.",
    "Planned - v6.0",
    "Parts: 1, 2 & 3",
    "DIY Kit: ~55 documents",
  ],
] as const;
export const services = [
  {
    tag: "Self-serve",
    name: "DIY Document Kit",
    intro:
      "A complete, editable documentation suite covering every clause of a supported ISO standard. Built by a practitioner - not generated from a template library.",
    items: [
      "147 documents for ISO 42001:2023 - policies, procedures, forms, checklists, registers",
      "Interactive browser to explore every document before requesting",
      "Guidance notes embedded in every document - purpose, instructions, customisation",
      "One standalone edition per standard - ISO 27001, 27701, 27035 and others planned",
      "One-time delivery - no subscriptions, no ongoing dependency",
    ],
    action: "Request the Kit",
    value: "kit",
  },
  {
    tag: "Cloud platform",
    name: "Compliance Platform",
    intro:
      "A multi-tenant compliance management platform - risks, controls, evidence, audits, and objectives in one place. Multi-standard by architecture from day one.",
    items: [
      "ISO 42001:2023 active now - ISO 27001, 27701 and others activated as data, not rebuild",
      "Role-based access - Tenant Admin, Contributor, Module User, Auditor",
      "Hosted SaaS or full on-premise installation on your own infrastructure",
      "Live Sample Inc. demo - fully populated environment to explore before activating",
      "Provisioned and supported by the StandardsOS team",
    ],
    action: "Request Demo",
    value: "platform",
  },
  {
    tag: "Expert-led",
    name: "Expert Consultancy",
    intro:
      "Practitioner-led advisory across ISO 42001, ISO 27001, ISO 27701, GDPR, DPDP, HIPAA, and NIST. An external enabler - engage at any stage, in any mode.",
    items: [
      "Kit + Consultant - Receive the document kit with hands-on implementation support alongside.",
      "Platform + Consultant - Activate your account with expert guidance running in parallel.",
      "Consultant only - Pure advisory, gap analysis, or audit readiness - no kit or platform required.",
    ],
    action: "Get in Touch",
    value: "consultancy",
  },
] as const;
export const valueCards = [
  [
    "🔄",
    "Continual Improvement",
    "Improvement register tracks actions from audits, incidents, and management reviews - closed loop from identification to verified closure.",
  ],
  [
    "🔍",
    "Audit Readiness",
    "Controls, evidence, NCRs, and CARs linked and visible at any time - no scrambling when an audit is announced.",
  ],
  [
    "⚡",
    "Operational Efficiency",
    "One platform replaces disconnected spreadsheets and email threads - compliance data in one place, always current.",
  ],
  [
    "🤝",
    "Customer Confidence",
    "Demonstrate compliance posture with structured, traceable evidence - not a folder of PDFs assembled before a client review.",
  ],
  [
    "👥",
    "Team Ownership",
    "Role-based access means the right people manage the right modules - compliance distributed, not bottlenecked on one person.",
  ],
  [
    "📋",
    "Management Review",
    "Dashboard, KPIs, audit results, and risk status on demand - management reviews run on real data, not retrospective summaries.",
  ],
  [
    "📈",
    "Multi-Standard Growth",
    "Start with one standard. Add ISO 27001, ISO 27701, and others as your programme matures - same platform, same team, no migration.",
  ],
  [
    "🏛️",
    "Regulatory Confidence",
    "Immutable audit trail on every write, soft delete only, data residency confirmed - built to satisfy regulators, not just auditors.",
  ],
] as const;
