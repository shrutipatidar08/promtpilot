import { PromptLog, PromptTemplate, AppSettings, PromptDraft } from '../types';

export const INITIAL_LOGS: PromptLog[] = [
  {
    id: 'log-1',
    score: 9.2,
    category: 'Coding',
    model: 'GPT-4o',
    timestamp: 'Oct 24, 14:30',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    originalPrompt: 'Write a python script to scrape data from a website and save it to a csv file.',
    optimizedPrompt: 'Act as an expert Python developer. Write a robust script using BeautifulSoup4 and Requests to scrape product names and prices from [URL]. Include comprehensive error handling for rate limits, pagination support, and save the parsed output directly into a clean CSV format with UTF-8 encoding.',
    originalTokens: 18,
    optimizedTokens: 56,
    isFavorite: true,
    scoreBreakdown: {
      clarity: 9.5,
      specificity: 9.3,
      context: 9.0,
      efficiency: 9.1,
      robustness: 9.4,
    },
    techniquesApplied: [
      'Role Conditioning (Expert Python Developer)',
      'Library Specification (BeautifulSoup4, Requests)',
      'Edge-Case Hardening (Rate limits, encoding)',
      'Structural Output Definition',
    ],
    rationale: 'Specified exact toolchain, edge cases (rate limits, pagination), and explicit file encoding to eliminate non-deterministic scripts.',
  },
  {
    id: 'log-2',
    score: 8.5,
    category: 'Marketing',
    model: 'Claude 3.5 Sonnet',
    timestamp: 'Oct 24, 11:15',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    originalPrompt: 'Write a blog post about the new features of our app.',
    optimizedPrompt: 'Draft an 800-word product announcement blog post targeted at existing power users. Highlight the top 3 new features: [Feature 1], [Feature 2], and [Feature 3]. Use an engaging, authoritative voice with bulleted benefits, actionable tips, and a clear call-to-action to try the update.',
    originalTokens: 14,
    optimizedTokens: 52,
    isFavorite: false,
    scoreBreakdown: {
      clarity: 8.7,
      specificity: 8.4,
      context: 8.3,
      efficiency: 8.6,
      robustness: 8.5,
    },
    techniquesApplied: [
      'Target Audience Calibration (Power Users)',
      'Word Count & Section Scaffolding',
      'Structural Deliverable Anchors',
    ],
    rationale: 'Defined explicit word count constraint, target audience persona, and conversion-focused call-to-action.',
  },
  {
    id: 'log-3',
    score: 7.8,
    category: 'Creative',
    model: 'GPT-4',
    timestamp: 'Oct 23, 09:45',
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
    originalPrompt: 'Give me ideas for a sci fi story.',
    optimizedPrompt: 'Brainstorm 5 unique high-concept sci-fi story hooks set in a post-scarcity society where human consciousness can be backed up but memory storage is privately auctioned. For each idea, include: Logline, Core Protagonist Dilemma, Antagonist Force, and the Central Philosophical Question.',
    originalTokens: 9,
    optimizedTokens: 49,
    isFavorite: true,
    scoreBreakdown: {
      clarity: 8.1,
      specificity: 7.9,
      context: 7.6,
      efficiency: 7.8,
      robustness: 7.7,
    },
    techniquesApplied: [
      'World-Building Constraints',
      'Template-Driven Deliverables (Logline, Dilemma, Antagonist)',
      'Philosophical Tension Framing',
    ],
    rationale: 'Narrowed open-ended prompt into a distinct thematic premise with four mandatory analytical structural points per story hook.',
  },
  {
    id: 'log-4',
    score: 9.6,
    category: 'Business',
    model: 'Gemini 3.7 Flash',
    timestamp: 'Oct 22, 16:20',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    originalPrompt: 'Help me write an email asking for budget approval for a new SaaS tool.',
    optimizedPrompt: 'Act as a Senior Operations Director. Compose a persuasive, executive-ready budget approval email for [Software Name] costing $[Amount]/year. Structure with: 1) Executive Summary, 2) Current Pain Points & Quantified Inefficiencies, 3) Projected ROI & Time-Savings, 4) Security/Compliance Overview, and 5) Implementation Timeline with Immediate Next Steps.',
    originalTokens: 16,
    optimizedTokens: 64,
    isFavorite: true,
    scoreBreakdown: {
      clarity: 9.8,
      specificity: 9.6,
      context: 9.5,
      efficiency: 9.4,
      robustness: 9.7,
    },
    techniquesApplied: [
      'Executive Tone Conditioning',
      'ROI & Business Case Scaffolding',
      'Compliance & Risk Mitigation Headers',
    ],
    rationale: 'Added financial rigor, executive framing, and structured justification points designed to preempt management objections.',
  },
  {
    id: 'log-5',
    score: 9.0,
    category: 'Reasoning',
    model: 'Gemini 3.1 Pro',
    timestamp: 'Oct 21, 13:10',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    originalPrompt: 'Analyze whether we should migrate from monolithic to microservices.',
    optimizedPrompt: 'You are an Enterprise Cloud Architect. Conduct a comprehensive architectural trade-off analysis for migrating an existing monolithic system to microservices. Evaluate against: 1) Team topology (Conway\'s Law), 2) Operational overhead & observability, 3) Transactional consistency (Saga vs 2PC), and 4) Infrastructure cost. Conclude with a decision matrix and phased migration roadmap.',
    originalTokens: 11,
    optimizedTokens: 66,
    isFavorite: false,
    scoreBreakdown: {
      clarity: 9.2,
      specificity: 9.1,
      context: 9.0,
      efficiency: 8.8,
      robustness: 9.2,
    },
    techniquesApplied: [
      'System Design Evaluation Matrix',
      'Conway\'s Law & Distributed Data Constraints',
      'Phased Migration Roadmap Framework',
    ],
    rationale: 'Framed abstract decision into specific architectural dimensions including team size, distributed transactions, and cost.',
  },
  {
    id: 'log-6',
    score: 8.8,
    category: 'Data',
    model: 'GPT-4o',
    timestamp: 'Oct 20, 10:05',
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
    originalPrompt: 'Create a SQL query to find churned users.',
    optimizedPrompt: 'You are a Senior PostgreSQL Data Engineer. Write an optimized SQL query to identify users whose last active session occurred more than 30 days ago, who had at least 3 historical purchases. Include comments explaining CTEs, window functions used, and recommendations for indexing (B-Tree vs Partial Indexes) on timestamp columns.',
    originalTokens: 8,
    optimizedTokens: 58,
    isFavorite: false,
    scoreBreakdown: {
      clarity: 9.0,
      specificity: 8.9,
      context: 8.7,
      efficiency: 8.8,
      robustness: 8.9,
    },
    techniquesApplied: [
      'Dialect Specification (PostgreSQL)',
      'Explicit Time Windows & User Cohorts',
      'Index Optimization Directives',
    ],
    rationale: 'Eliminated vague definitions of churn by locking in 30-day window, purchase thresholds, and indexing guidance.',
  },
  {
    id: 'log-7',
    score: 9.4,
    category: 'Coding',
    model: 'Claude 3.5 Sonnet',
    timestamp: 'Oct 19, 18:45',
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    originalPrompt: 'Fix this React useEffect infinite loop bug.',
    optimizedPrompt: 'Act as a Senior React Core Engineer. Analyze the provided React component for infinite re-render triggers inside useEffect hooks. Identify object/array dependency mutations, missing useCallback/useMemo wrappers, and provide: 1) Root-cause explanation, 2) Clean refactored TypeScript snippet, and 3) Best-practice preventative checklist for the team.',
    originalTokens: 8,
    optimizedTokens: 54,
    isFavorite: true,
    scoreBreakdown: {
      clarity: 9.6,
      specificity: 9.4,
      context: 9.3,
      efficiency: 9.2,
      robustness: 9.5,
    },
    techniquesApplied: [
      'Root-Cause Diagnostic Directive',
      'Strict TypeScript Output Rules',
      'Engineering Prevention Checklist',
    ],
    rationale: 'Ensures the AI explains why the re-render happens and delivers strict TypeScript with dependency stabilization.',
  }
];

export const INITIAL_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Full-Stack Component Architect',
    description: 'Generates production-ready, clean TypeScript React components with accessible styling and error boundaries.',
    category: 'Coding',
    recommendedModel: 'Gemini 3.7 Flash',
    score: 9.7,
    tags: ['React', 'TypeScript', 'Tailwind', 'Accessibility'],
    variables: ['Component Name', 'Props Description', 'Styling Library'],
    prompt: `You are a Principal Frontend Architect. Create a modular, highly accessible {{Component Name}} component in TypeScript React.

Requirements:
- Target Styling: {{Styling Library}}
- Expected Props: {{Props Description}}
- Adhere strictly to WAI-ARIA standards with keyboard navigation.
- Implement defensive fallback UI and strict typing (no 'any').
- Provide clean usage examples and unit test outlines.`,
  },
  {
    id: 'tpl-2',
    title: 'High-Conversion SaaS Landing Page Copy',
    description: 'Drafts high-intent value propositions, hero headlines, and customer objection busters.',
    category: 'Marketing',
    recommendedModel: 'Claude 3.5 Sonnet',
    score: 9.5,
    tags: ['Copywriting', 'Conversion', 'SaaS', 'Hero Section'],
    variables: ['Product Name', 'Target ICP', 'Core Value Prop'],
    prompt: `Act as a legendary direct-response copywriter. Craft conversion-optimized landing page copy for {{Product Name}}, tailored to {{Target ICP}}.

Key Value Proposition: {{Core Value Prop}}

Deliverables:
1. 3 High-Impact Hero Headlines with subheaders (testing curiosity, direct benefit, and social proof angles).
2. Bulleted feature-to-benefit translations focusing on time/money saved.
3. 3 Objection-busting FAQ entries.
4. Primary and secondary Call-To-Action button copy.`,
  },
  {
    id: 'tpl-3',
    title: 'Executive Decision Memo (Amazon 6-Pager Style)',
    description: 'Formats complex technical or business dilemmas into clear, concise executive narratives.',
    category: 'Business',
    recommendedModel: 'GPT-4o',
    score: 9.6,
    tags: ['Strategy', 'Leadership', 'Decision Matrix', 'Amazon Style'],
    variables: ['Proposal Subject', 'Primary Problem', 'Recommended Solution'],
    prompt: `You are a Chief of Staff at a Fortune 50 company. Draft an executive decision memo regarding: {{Proposal Subject}}.

Core Problem Context: {{Primary Problem}}
Proposed Initiative: {{Recommended Solution}}

Structure:
- 1. Executive Summary & Core Ask
- 2. Background & Strategic Alignment
- 3. Proposed Solution & Architecture
- 4. Financial & Operational Impact
- 5. Key Risks, Pre-Mortem & Mitigation Strategy
- 6. Clear Decision Matrix & Recommendation`,
  },
  {
    id: 'tpl-4',
    title: 'Database Schema & Query Optimizer',
    description: 'Designs normalized SQL schemas with optimized indexes, foreign keys, and performant query examples.',
    category: 'Data',
    recommendedModel: 'Gemini 3.7 Flash',
    score: 9.4,
    tags: ['PostgreSQL', 'Indexes', 'Schema Design', 'Performance'],
    variables: ['Domain Model', 'Expected Scale', 'Key Query Patterns'],
    prompt: `You are a Principal Database Administrator. Design an optimized PostgreSQL schema for {{Domain Model}}.

Context & Scale: {{Expected Scale}}
Crucial Query Access Patterns: {{Key Query Patterns}}

Provide:
1. Complete DDL with constraints, UUID primary keys, and appropriate data types.
2. Indexing strategy (covering indexes, partial indexes where advantageous).
3. EXPLAIN ANALYZE tuning advice for the primary queries.`,
  },
  {
    id: 'tpl-5',
    title: 'Chain-of-Thought Algorithmic Solver',
    description: 'Enforces step-by-step rigorous logical deduction, mathematical proofs, and constraint checking.',
    category: 'Reasoning',
    recommendedModel: 'Gemini 3.1 Pro',
    score: 9.8,
    tags: ['Logic', 'Chain-of-Thought', 'Algorithms', 'Verification'],
    variables: ['Problem Statement', 'Constraints', 'Expected Time Complexity'],
    prompt: `You are a Theoretical Computer Scientist. Solve the following algorithmic challenge using rigorous step-by-step reasoning:

Problem: {{Problem Statement}}
Constraints: {{Constraints}}
Target Complexity: {{Expected Time Complexity}}

Process:
- Step 1: Restate the problem and define all invariants.
- Step 2: Explore naive approach and articulate bottlenecks.
- Step 3: Propose optimal data structure/algorithm.
- Step 4: Step-by-step mathematical proof of correctness.
- Step 5: Clean, commented implementation with time/space complexity analysis.`,
  }
];

export const INITIAL_DRAFTS: PromptDraft[] = [
  {
    id: 'draft-1',
    title: 'Customer Onboarding Sequence',
    content: 'Write an onboarding email for users who just signed up for our analytics dashboard.',
    category: 'Marketing',
    targetModel: 'Claude 3.5 Sonnet',
    goal: 'Max Quality',
    lastModified: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'draft-2',
    title: 'FastAPI Rate Limiting Middleware',
    content: 'Create a redis-backed rate limiting middleware for a FastAPI backend with tiered user quotas.',
    category: 'Coding',
    targetModel: 'GPT-4o',
    goal: 'Cost & Speed',
    lastModified: Date.now() - 1000 * 60 * 180,
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  apiKeys: {
    openai: 'sk-proj-••••••••••••••••••••••••••••••••••••',
    anthropic: 'sk-ant-••••••••••••••••••••••••••••••••••••',
    google: 'AIza••••••••••••••••••••••••••••••••',
    deepseek: '',
  },
  optimizationGoal: 'Cost & Speed',
  autoFallback: true,
  defaultModel: 'GPT-4o',
  temperature: 0.7,
  maxTokens: 2048,
  thinkingLevel: 'HIGH',
  darkMode: true,
  advancedRouting: {
    enableCostCapping: true,
    maxCostPerQuery: 0.05,
    enableLatencyOptimization: true,
  },
};
