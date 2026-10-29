// All data in this walkthrough is simulated. Jarrah Insurance is fictional.

export const COMPANY = "Jarrah Insurance";
export const VM_SLUG = "jarrah-agent";
export const VM_ID = `vmc/${VM_SLUG}`;

export const CURRENT_MODEL = "anthropic/claude-opus-5.5";
export const NEW_MODEL = "openai/gpt-6.1-sol";

export type Agent = {
  id: string;
  name: string;
  team: string;
  repo: string;
  hardcoded: string;
  zdrBefore: boolean;
  rpm: number; // simulated requests per minute
};

export const AGENTS: Agent[] = [
  { id: "claims-triage", name: "Claims triage", team: "Claims", repo: "claims-platform", hardcoded: "anthropic/claude-sonnet-4.5", zdrBefore: true, rpm: 410 },
  { id: "damage-photos", name: "Damage photo review", team: "Claims", repo: "claims-platform", hardcoded: "google/gemini-2.5-pro", zdrBefore: true, rpm: 180 },
  { id: "fraud-signals", name: "Fraud signals", team: "Fraud", repo: "fraud-engine", hardcoded: "anthropic/claude-opus-4.1", zdrBefore: true, rpm: 95 },
  { id: "call-summary", name: "Call summariser", team: "Contact centre", repo: "cc-tools", hardcoded: "openai/gpt-5-mini", zdrBefore: true, rpm: 620 },
  { id: "policy-chat", name: "Policy Q&A chat", team: "Digital", repo: "jarrah-web", hardcoded: "anthropic/claude-sonnet-4.5", zdrBefore: true, rpm: 540 },
  { id: "underwriting", name: "Underwriting assistant", team: "Underwriting", repo: "uw-workbench", hardcoded: "anthropic/claude-opus-4.1", zdrBefore: true, rpm: 60 },
  { id: "broker-email", name: "Broker email drafter", team: "Broker", repo: "broker-portal", hardcoded: "openai/gpt-5", zdrBefore: false, rpm: 140 },
  { id: "complaints", name: "Complaints classifier", team: "Contact centre", repo: "cc-tools", hardcoded: "openai/gpt-5-mini", zdrBefore: true, rpm: 120 },
  { id: "contract-review", name: "Contract review", team: "Legal", repo: "legal-ops", hardcoded: "anthropic/claude-opus-4.1", zdrBefore: true, rpm: 8 },
  { id: "coding-agent", name: "Platform coding agent", team: "Platform", repo: "platform-tools", hardcoded: "anthropic/claude-sonnet-4.5", zdrBefore: true, rpm: 75 },
  { id: "pds-extract", name: "PDS document extraction", team: "Product", repo: "doc-pipeline", hardcoded: "google/gemini-2.5-pro", zdrBefore: true, rpm: 210 },
  { id: "hr-helper", name: "HR policy helper", team: "People", repo: "intranet", hardcoded: "openai/gpt-5-mini", zdrBefore: true, rpm: 30 },
];

export const REPOS = new Set(AGENTS.map((a) => a.repo)).size; // 9
export const DISTINCT_STRINGS = new Set(AGENTS.map((a) => a.hardcoded)).size; // 5

// Simulated rollout of one model change the old way, per agent (business day the deploy lands)
export const ROLL_DAYS: Record<string, number | null> = {
  "coding-agent": 2,
  "claims-triage": 4,
  "policy-chat": 5,
  "damage-photos": 7,
  "call-summary": 8,
  "pds-extract": 10,
  "fraud-signals": 12,
  "underwriting": 14,
  "broker-email": 15,
  "contract-review": 17,
  "hr-helper": 19,
  "complaints": null, // still in the backlog when the change is "done"
};

export const BEFORE = {
  prs: 12,
  deploys: 12,
  days: 19,
  engineerHours: 64,
  missedZdr: 1,
  leftBehind: 1,
};

export const AFTER = {
  edits: 1,
  prs: 0,
  deploys: 0,
  minutesOfWork: 15,
};

export const VALUE = {
  spendOldPerMonth: 186000,
  spendNewPerMonth: 121000,
  savedPerMonth: 65000,
  savedPerYear: 780000,
  lagSavingsLost: 58500, // ~27 calendar days of savings during a 19 business day rollout
  changesPerYear: 8,
  hoursPerYearBefore: 512, // 8 x 64
  prsPerYearBefore: 96, // 8 x 12
  hourlyRate: 160,
  engineeringPerYear: 81920, // 512 x $160
};

export const fmtAUD = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n).replace("$", "A$");
export const fmtNum = (n: number) => new Intl.NumberFormat("en-AU").format(n);
