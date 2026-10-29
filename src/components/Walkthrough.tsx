"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AFTER, AGENTS, BEFORE, COMPANY, CURRENT_MODEL, DISTINCT_STRINGS, NEW_MODEL, REPOS, ROLL_DAYS, VALUE, VM_ID, VM_SLUG, fmtAUD, fmtNum,
} from "./data";

const STEPS = [
  { key: "issue", label: "The issue" },
  { key: "before", label: "Before: a model change" },
  { key: "line", label: "One model ID" },
  { key: "after", label: "After: flip it once" },
  { key: "compare", label: "Side by side" },
  { key: "value", label: "The value" },
] as const;

/* ---------- primitives ---------- */

function VercelMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" className={className} aria-hidden>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
    </svg>
  );
}

function SimBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/40 bg-warn/10 px-2.5 py-1 text-[11px] font-medium text-warn">
      <span className="h-1.5 w-1.5 rounded-full bg-warn" /> Fictional company · simulated data
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{children}</div>;
}

function Heading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl space-y-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        {sub && <p className="text-[15px] leading-relaxed text-muted">{sub}</p>}
      </div>
      <SimBadge />
    </div>
  );
}

function Pill({ tone, children }: { tone: "good" | "bad" | "warn" | "muted" | "blue"; children: React.ReactNode }) {
  const map = {
    good: "border-success/40 bg-success/10 text-success",
    bad: "border-danger/40 bg-danger/10 text-danger",
    warn: "border-warn/40 bg-warn/10 text-warn",
    muted: "border-border bg-card-2 text-muted",
    blue: "border-blue/40 bg-blue/10 text-blue",
  } as const;
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}>{children}</span>;
}

function Code({ title, children, tone }: { title: string; children: React.ReactNode; tone?: "bad" | "good" }) {
  const ring = tone === "bad" ? "border-danger/40" : tone === "good" ? "border-success/40" : "border-border";
  return (
    <div className={`overflow-hidden rounded-xl border ${ring} bg-[#050505]`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-[11.5px] text-muted">{title}</span>
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#222]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#222]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#222]" />
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.7] text-[#d4d4d4]">{children}</pre>
    </div>
  );
}

const K = ({ children }: { children: React.ReactNode }) => <span className="text-[#ff7b72]">{children}</span>;
const S = ({ children }: { children: React.ReactNode }) => <span className="text-[#a5d6ff]">{children}</span>;
const C = ({ children }: { children: React.ReactNode }) => <span className="text-[#6e7681]">{children}</span>;
const Hl = ({ children, tone }: { children: React.ReactNode; tone: "bad" | "good" }) => (
  <span className={tone === "bad" ? "rounded bg-danger/15 px-0.5 text-danger" : "rounded bg-success/15 px-0.5 text-success"}>{children}</span>
);

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "bad" | "good" }) {
  return (
    <div className="rounded-lg border border-border bg-card-2 px-4 py-3">
      <div className="text-[11.5px] text-subtle">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${tone === "bad" ? "text-danger" : tone === "good" ? "text-success" : ""}`}>{value}</div>
    </div>
  );
}

/* ---------- Step 1: the issue ---------- */

function StepIssue() {
  return (
    <div className="space-y-7">
      <Heading
        eyebrow={`${COMPANY} · 12 AI agents in production`}
        title="Twelve agents. Twelve hardcoded model strings."
        sub={
          <>
            {COMPANY} runs AI agents across claims, fraud, the contact centre, underwriting, legal and more. Every team picked a model and typed the string into its own code. Today that is {DISTINCT_STRINGS} different model strings across {REPOS} repos, each with its own fallbacks, and Zero Data Retention set agent by agent.
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Agents in production" value="12" />
        <Stat label="Repos with a model string" value={REPOS} />
        <Stat label="Different model strings" value={DISTINCT_STRINGS} tone="bad" />
        <Stat label="Agents with ZDR set" value="11 / 12" tone="bad" />
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_1.6fr_0.8fr] gap-3 border-b border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-subtle">
          <span>Agent</span><span>Repo</span><span>Model string in code</span><span>ZDR</span>
        </div>
        {AGENTS.map((a, i) => (
          <div key={a.id} className="row-in grid grid-cols-[1.4fr_1fr_1.6fr_0.8fr] items-center gap-3 border-b border-border/60 px-4 py-2.5 text-[13px] last:border-0" style={{ animationDelay: `${i * 40}ms` }}>
            <span>
              <span className="font-medium">{a.name}</span>
              <span className="ml-2 text-[11.5px] text-subtle">{a.team}</span>
            </span>
            <span className="font-mono text-[12px] text-muted">{a.repo}</span>
            <span className="font-mono text-[12px] text-danger/90">&apos;{a.hardcoded}&apos;</span>
            <span>{a.zdrBefore ? <Pill tone="muted">set in code</Pill> : <Pill tone="bad">not set</Pill>}</span>
          </div>
        ))}
      </Card>
      <p className="text-[13px] text-subtle">About ten new models land on AI Gateway every week. Every one of them is a reason to touch all twelve.</p>
    </div>
  );
}

/* ---------- Step 2: before ---------- */

function statusFor(agentId: string, day: number): { label: string; tone: "muted" | "warn" | "good" | "bad" } {
  const land = ROLL_DAYS[agentId];
  if (land === null) {
    if (day >= 6) return { label: "PR stuck in backlog", tone: "bad" };
    if (day >= 3) return { label: "PR open", tone: "warn" };
    return { label: "Waiting", tone: "muted" };
  }
  if (day >= land) return { label: "Deployed", tone: "good" };
  if (day >= land - 3) return { label: "PR in review", tone: "warn" };
  return { label: "Waiting", tone: "muted" };
}

function StepBefore() {
  const [day, setDay] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const start = () => {
    if (timer.current) clearInterval(timer.current);
    setDay(0);
    setRunning(true);
    timer.current = setInterval(() => {
      setDay((d) => {
        if (d >= BEFORE.days) {
          if (timer.current) clearInterval(timer.current);
          setRunning(false);
          return d;
        }
        return d + 1;
      });
    }, 320);
  };

  const started = running || day > 0;
  const prs = AGENTS.filter((a) => { const l = ROLL_DAYS[a.id]; return l === null ? day >= 3 : day >= l - 3; }).length;
  const deployed = AGENTS.filter((a) => { const l = ROLL_DAYS[a.id]; return l !== null && day >= l; }).length;
  const hours = Math.round((BEFORE.engineerHours * day) / BEFORE.days);
  const done = day >= BEFORE.days;

  return (
    <div className="space-y-7">
      <Heading
        eyebrow="Before · the old way"
        title="A better, cheaper model lands. Now touch twelve codebases."
        sub={<>Risk also wants Zero Data Retention on every agent, and the platform team wants <span className="font-mono text-foreground">{NEW_MODEL}</span> everywhere. With the model string in code, that is a pull request, a review and a deploy per agent, team by team.</>}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={start} disabled={running} className="rounded-md bg-white px-4 py-2 text-[13px] font-medium text-black hover:bg-[#ddd] disabled:opacity-40">
          {started ? "↻ Replay the rollout" : "▶ Roll out the new model the old way"}
        </button>
        {started && <span className="font-mono text-[12px] text-muted">Business day <span className="text-foreground">{day}</span> / {BEFORE.days}</span>}
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Pull requests opened" value={prs} tone={started ? "bad" : undefined} />
        <Stat label="Deploys done" value={`${deployed} / 12`} />
        <Stat label="Engineer hours" value={hours} tone={started ? "bad" : undefined} />
        <Stat label="Business days so far" value={day} tone={started ? "bad" : undefined} />
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_1.5fr_1fr] gap-3 border-b border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-subtle">
          <span>Agent</span><span>Repo</span><span>Model string</span><span>Status</span>
        </div>
        {AGENTS.map((a) => {
          const s = statusFor(a.id, day);
          const moved = s.label === "Deployed";
          const zdrMiss = moved && !a.zdrBefore;
          return (
            <div key={a.id} className="grid grid-cols-[1.4fr_1fr_1.5fr_1fr] items-center gap-3 border-b border-border/60 px-4 py-2.5 text-[13px] last:border-0">
              <span className="font-medium">{a.name}</span>
              <span className="font-mono text-[12px] text-muted">{a.repo}</span>
              <span className={`font-mono text-[12px] transition-colors ${moved ? "text-foreground" : "text-danger/90"}`}>&apos;{moved ? NEW_MODEL : a.hardcoded}&apos;</span>
              <span className="flex flex-wrap gap-1">
                <Pill tone={s.tone}>{s.label}</Pill>
                {zdrMiss && <Pill tone="bad">ZDR missed</Pill>}
              </span>
            </div>
          );
        })}
      </Card>
      {done && (
        <Card className="fade-in border-danger/40 p-5">
          <div className="text-[15px] font-medium">Nineteen business days later: {BEFORE.prs} pull requests, {BEFORE.engineerHours} engineer hours, one agent still on the old model, and one shipped without Zero Data Retention.</div>
          <div className="mt-1 text-[13px] text-muted">The broker email drafter never had ZDR in its code, so the new deploy went out without it. Nobody noticed in review. And by then, the next model has already landed.</div>
        </Card>
      )}
    </div>
  );
}

/* ---------- Step 3: one model ID ---------- */

function StepLine() {
  return (
    <div className="space-y-7">
      <Heading
        eyebrow="What we solve"
        title="One virtual model ID. Configured once, in AI Gateway."
        sub={<>A Virtual Model on Vercel AI Gateway is a model ID your team owns, like <span className="font-mono text-foreground">{VM_ID}</span>. Behind it sits the real model, the fallbacks and Zero Data Retention. Every agent uses the ID. The platform team changes what is behind it.</>}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="text-[13px] text-muted">Before: in each of 12 agents</div>
          <Code title="broker-portal/agents/email-drafter.ts" tone="bad">
            <K>import</K> {"{ streamText }"} <K>from</K> <S>&apos;ai&apos;</S>;{"\n\n"}
            <K>const</K> result = streamText({"{"}{"\n"}
            {"  "}model: <Hl tone="bad">&apos;openai/gpt-5&apos;</Hl>, <C>{"// hardcoded, 1 of 12"}</C>{"\n"}
            {"  "}prompt,{"\n"}
            {"  "}providerOptions: {"{"}{"\n"}
            {"    "}gateway: {"{"}{"\n"}
            {"      "}models: [<Hl tone="bad">&apos;anthropic/claude-sonnet-4.5&apos;</Hl>],{"\n"}
            {"      "}<C>{"// zeroDataRetention: forgot this one"}</C>{"\n"}
            {"    "}{"}"},{"\n"}
            {"  "}{"}"},{"\n"}
            {"}"});
          </Code>
        </div>
        <div className="space-y-2">
          <div className="text-[13px] text-muted">After: the same line in all 12 agents</div>
          <Code title="broker-portal/agents/email-drafter.ts" tone="good">
            <K>import</K> {"{ streamText }"} <K>from</K> <S>&apos;ai&apos;</S>;{"\n\n"}
            <K>const</K> result = streamText({"{"}{"\n"}
            {"  "}model: <Hl tone="good">&apos;{VM_ID}&apos;</Hl>,{"\n"}
            {"  "}prompt,{"\n"}
            {"}"});{"\n\n"}
            <C>{"// Model, fallbacks and Zero Data Retention"}</C>{"\n"}
            <C>{"// live in AI Gateway, not in this file."}</C>
          </Code>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-[13px] text-muted">Set up once by the platform team, from the dashboard or the Vercel CLI</div>
        <Code title="terminal">
          <C>{"# create the virtual model once"}</C>{"\n"}
          vercel ai-gateway virtual-models create {VM_SLUG} \{"\n"}
          {"  "}--model {CURRENT_MODEL} \{"\n"}
          {"  "}--config <S>&apos;{"{"}&quot;zeroDataRetention&quot;:true{"}"}&apos;</S>{"\n\n"}
          <C>{"# a better model lands: one edit, every agent follows"}</C>{"\n"}
          vercel ai-gateway virtual-models edit {VM_SLUG} --model {NEW_MODEL}
        </Code>
      </div>
      <p className="text-[13px] text-subtle">Rauch called it &ldquo;DNS for models&rdquo;: agents keep one name, the gateway decides where it points.</p>
    </div>
  );
}

/* ---------- Step 4: after (interactive gateway) ---------- */

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-pressed={on} aria-label={label} className={`relative h-6 w-11 shrink-0 rounded-full border transition ${on ? "border-success bg-success" : "border-border bg-[#1a1a1a]"}`}>
      <span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function StepAfter() {
  const [target, setTarget] = useState(CURRENT_MODEL);
  const [applied, setApplied] = useState<string[]>(() => AGENTS.map(() => CURRENT_MODEL));
  const [flash, setFlash] = useState<boolean[]>(() => AGENTS.map(() => false));
  const [switching, setSwitching] = useState(false);
  const [switches, setSwitches] = useState(0);
  const [zdr, setZdr] = useState(false);
  const [incident, setIncident] = useState(false);
  const [optOut, setOptOut] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const other = target === CURRENT_MODEL ? NEW_MODEL : CURRENT_MODEL;
  const fallback = target === CURRENT_MODEL ? NEW_MODEL : CURRENT_MODEL;
  const movedCount = applied.filter((m) => m === target).length;
  const zdrCount = AGENTS.filter((a) => zdr || a.zdrBefore).length;
  const rpm = AGENTS.reduce((s, a) => s + a.rpm, 0);

  const doSwitch = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const next = other;
    setTarget(next);
    setSwitching(true);
    setSwitches((n) => n + 1);
    AGENTS.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setApplied((prev) => prev.map((m, j) => (j === i ? next : m)));
          setFlash((prev) => prev.map((f, j) => (j === i ? true : f)));
          timers.current.push(setTimeout(() => setFlash((prev) => prev.map((f, j) => (j === i ? false : f))), 700));
          if (i === AGENTS.length - 1) setSwitching(false);
        }, 250 + i * 170),
      );
    });
  };

  return (
    <div className="space-y-6">
      <Heading
        eyebrow="After · the Vercel way"
        title="Flip it once in the gateway. Every agent follows."
        sub="Every agent calls the same virtual model ID. Change the model, turn on Zero Data Retention or ride out a provider incident from one place, with no pull request and no redeploy."
      />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        {/* Gateway panel */}
        <Card className="h-fit overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <VercelMark className="h-3.5 w-3.5" />
              <span className="text-[13px] font-medium">AI Gateway · Virtual Models</span>
            </div>
            <Pill tone="muted">{COMPANY}</Pill>
          </div>
          <div className="space-y-5 p-4">
            <div>
              <div className="text-[11.5px] text-subtle">Virtual model ID</div>
              <div className="mt-1 font-mono text-[15px] font-medium">{VM_ID}</div>
              <div className="mt-1 text-[12px] text-muted">Used by 12 agents · {fmtNum(rpm)} requests/min</div>
            </div>
            <div>
              <div className="text-[11.5px] text-subtle">Model</div>
              <div className={`mt-1 rounded-md border px-3 py-2 font-mono text-[13px] transition ${switching ? "border-white" : "border-border"} bg-card-2`}>{target}</div>
              <button onClick={doSwitch} disabled={switching} className="mt-2 w-full rounded-md bg-white px-3 py-2 text-[13px] font-medium text-black hover:bg-[#ddd] disabled:opacity-40">
                {switching ? "Applying to every agent…" : `Switch to ${other}`}
              </button>
            </div>
            <div>
              <div className="text-[11.5px] text-subtle">Fallbacks</div>
              <div className="mt-1 rounded-md border border-border bg-card-2 px-3 py-2 font-mono text-[12.5px] text-muted">1. {fallback}</div>
              <div className="mt-1 text-[11.5px] text-subtle">Set here, so no agent picks its own.</div>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card-2 px-3 py-2.5">
              <div>
                <div className="text-[13px] font-medium">Zero Data Retention</div>
                <div className="text-[11.5px] text-subtle">Enforced on every request</div>
              </div>
              <Toggle on={zdr} onClick={() => { setZdr((z) => !z); setOptOut(false); }} label="Zero Data Retention" />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card-2 px-3 py-2.5">
              <div>
                <div className="text-[13px] font-medium">Simulate a provider incident</div>
                <div className="text-[11.5px] text-subtle">Primary model&apos;s provider goes down</div>
              </div>
              <Toggle on={incident} onClick={() => setIncident((x) => !x)} label="Provider incident" />
            </div>
          </div>
        </Card>

        {/* Fleet */}
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Agents on target model" value={`${movedCount} / 12`} tone={movedCount === 12 ? "good" : undefined} />
            <Stat label="Pull requests" value="0" tone="good" />
            <Stat label="Redeploys" value="0" tone="good" />
            <Stat label="Agents with ZDR" value={`${zdrCount} / 12`} tone={zdrCount === 12 ? "good" : "bad"} />
          </div>
          {incident && (
            <div className="fade-in rounded-lg border border-warn/40 bg-warn/10 px-4 py-2.5 text-[13px] text-warn">
              Provider incident on {target.split("/")[0]}: every agent is being served by the central fallback {fallback}. Customers see no errors.
            </div>
          )}
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {AGENTS.map((a, i) => {
              const served = incident ? fallback : applied[i];
              const hasZdr = zdr || a.zdrBefore;
              return (
                <div key={a.id} className={`rounded-lg border p-3 transition-all duration-300 ${flash[i] ? "border-white bg-[#151515]" : "border-border bg-card"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[13px] font-medium leading-tight">{a.name}</div>
                      <div className="text-[11px] text-subtle">{a.team}</div>
                    </div>
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${flash[i] ? "pulse-dot bg-white" : "bg-success"}`} />
                  </div>
                  <div className="mt-2.5 font-mono text-[11px] text-muted">model: &apos;{VM_ID}&apos;</div>
                  <div className="mt-0.5 truncate font-mono text-[11px]">
                    <span className="text-subtle">→ </span>
                    <span className={incident ? "text-warn" : "text-foreground"}>{served}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hasZdr ? <Pill tone="good">ZDR</Pill> : <Pill tone="bad">No ZDR</Pill>}
                    {incident && <Pill tone="warn">fallback</Pill>}
                  </div>
                </div>
              );
            })}
          </div>
          {switches > 0 && !switching && (
            <div className="fade-in rounded-lg border border-success/40 bg-success/10 px-4 py-2.5 text-[13px] text-success">
              One edit in the gateway. All 12 agents now resolve {VM_ID} to {target}, live within minutes. 0 pull requests, 0 redeploys, not a line of agent code changed.
            </div>
          )}
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-medium">What if an agent tries to switch ZDR off?</div>
                <div className="text-[12px] text-subtle">The broker email drafter sends a request with zeroDataRetention: false.</div>
              </div>
              <button onClick={() => setOptOut(true)} disabled={!zdr} className="rounded-md border border-border px-3 py-1.5 text-[12.5px] hover:border-white disabled:opacity-40">
                {zdr ? "Send that request" : "Turn on ZDR first"}
              </button>
            </div>
            {optOut && zdr && (
              <div className="fade-in mt-3 grid gap-2 font-mono text-[12px] sm:grid-cols-2">
                <div className="rounded-md border border-border bg-card-2 p-3">
                  <div className="text-subtle">request from broker-email</div>
                  <div className="mt-1">zeroDataRetention: <span className="text-danger">false</span></div>
                </div>
                <div className="rounded-md border border-success/40 bg-success/10 p-3">
                  <div className="text-subtle">resolved by {VM_ID}</div>
                  <div className="mt-1">zeroDataRetention: <span className="text-success">true</span> <span className="text-subtle">· virtual model wins</span></div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 5: compare ---------- */

const ROWS: [string, string, string][] = [
  ["Where the model lives", "Hardcoded in 12 agents across 9 repos", `One ID: ${VM_ID}`],
  ["Roll out a new model", `${BEFORE.prs} PRs, ${BEFORE.deploys} deploys`, "1 edit in AI Gateway"],
  ["Time to every agent", `${BEFORE.days} business days`, "Minutes"],
  ["Engineer time per change", `${BEFORE.engineerHours} hours`, `${AFTER.minutesOfWork} minutes`],
  ["Agents left behind", `${BEFORE.leftBehind} still on the old model`, "None"],
  ["Zero Data Retention", "11 / 12, one missed in review", "12 / 12, enforced centrally"],
  ["Fallbacks", "Each agent picks its own", "One policy, set in the gateway"],
  ["Can an agent override policy?", "Yes, it is in their code", "No, virtual model settings win"],
];

function StepCompare() {
  return (
    <div className="space-y-7">
      <Heading eyebrow="Side by side" title="Same twelve agents. One place to govern them." sub="Per model change at Jarrah Insurance. Simulated example figures." />
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1.1fr_1.2fr_1.2fr] gap-4 border-b border-border px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-subtle">
          <span />
          <span>Hardcoded model strings</span>
          <span className="text-foreground">Virtual Models on AI Gateway</span>
        </div>
        {ROWS.map(([k, b, a], i) => (
          <div key={k} className="row-in grid grid-cols-[1.1fr_1.2fr_1.2fr] items-center gap-4 border-b border-border/60 px-5 py-3.5 text-[14px] last:border-0" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="text-muted">{k}</span>
            <span className="text-danger/90">{b}</span>
            <span className="font-medium text-success">{a}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ---------- Step 6: value ---------- */

function Metric({ label, before, after, note }: { label: string; before: string; after: string; note?: string }) {
  return (
    <Card className="p-5">
      <div className="text-[12.5px] text-muted">{label}</div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="whitespace-nowrap text-lg font-medium text-subtle line-through decoration-danger/60">{before}</span>
        <span className="text-subtle">→</span>
        <span className="whitespace-nowrap text-3xl font-semibold">{after}</span>
      </div>
      {note && <div className="mt-2 text-[12px] text-subtle">{note}</div>}
    </Card>
  );
}

function StepValue() {
  return (
    <div className="space-y-7">
      <Heading eyebrow="The value" title="New models in minutes. Compliance everywhere. Engineers back on the roadmap." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Time to roll out a model change" before={`${BEFORE.days} days`} after="Minutes" note="Across all 12 agents" />
        <Metric label="Pull requests a year for model changes" before={fmtNum(VALUE.prsPerYearBefore)} after="0" note={`${VALUE.changesPerYear} model changes a year`} />
        <Metric label="Engineer hours a year" before={fmtNum(VALUE.hoursPerYearBefore)} after="2" note={`${fmtAUD(VALUE.engineeringPerYear)} of engineering time back`} />
        <Metric label="Agents with Zero Data Retention" before="11 / 12" after="12 / 12" note="Enforced in the gateway, every request" />
      </div>
      <Card className="grid-bg flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center">
        <div>
          <div className="text-[13px] text-muted">Inference spend after moving every agent to the better, cheaper model</div>
          <div className="mt-1 text-[13px] text-subtle">
            {fmtAUD(VALUE.spendOldPerMonth)} → {fmtAUD(VALUE.spendNewPerMonth)} a month, captured from day one instead of after a {BEFORE.days}-day rollout ({fmtAUD(VALUE.lagSavingsLost)} that used to be lost per change)
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-semibold tracking-tight sm:text-5xl">{fmtAUD(VALUE.savedPerYear)}</div>
          <div className="text-[12px] text-subtle">saved a year · simulated</div>
        </div>
      </Card>
      <p className="text-[12px] text-subtle">
        {COMPANY} is fictional. Agents, request volumes, spend, hours and timelines are simulated example figures for illustration. Model IDs shown are examples.
      </p>
    </div>
  );
}

/* ---------- Shell ---------- */

export default function Walkthrough() {
  const [step, setStep] = useState(0);
  const go = useCallback((n: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, n));
    setStep(next);
    if (typeof window !== "undefined") window.history.replaceState(null, "", `#${next + 1}`);
  }, []);
  useEffect(() => {
    const n = parseInt(window.location.hash.replace("#", ""), 10);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (n >= 1 && n <= STEPS.length) setStep(n - 1);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, go]);

  const views = [<StepIssue key="0" />, <StepBefore key="1" />, <StepLine key="2" />, <StepAfter key="3" />, <StepCompare key="4" />, <StepValue key="5" />];

  return (
    <div className="grid-bg flex min-h-screen flex-col">
      <header className="border-b border-border bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <VercelMark />
            <span className="text-[#333]">/</span>
            <span className="text-[14px] font-medium">AI Gateway</span>
            <span className="hidden rounded-full border border-border px-2 py-0.5 text-[11px] text-muted sm:inline">Virtual Models</span>
          </div>
          <div className="text-[12px] text-subtle">{COMPANY} · fictional, simulated</div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 pb-3">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => go(i)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition ${
                i === step ? "bg-white text-black" : "text-muted hover:bg-card-2 hover:text-foreground"
              }`}
            >
              <span className={`font-mono text-[11px] ${i === step ? "text-black/60" : "text-subtle"}`}>{i + 1}</span>
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div key={step} className="fade-in">{views[step]}</div>
      </main>

      <footer className="border-t border-border bg-black/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button onClick={() => go(step - 1)} disabled={step === 0} className="rounded-md border border-border px-4 py-2 text-[13px] text-muted hover:text-foreground disabled:opacity-30">← Back</button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <span key={s.key} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-white" : "w-1.5 bg-[#333]"}`} />
            ))}
          </div>
          <button onClick={() => go(step + 1)} disabled={step === STEPS.length - 1} className="rounded-md bg-white px-4 py-2 text-[13px] font-medium text-black hover:bg-[#ddd] disabled:opacity-30">Next →</button>
        </div>
      </footer>
    </div>
  );
}
