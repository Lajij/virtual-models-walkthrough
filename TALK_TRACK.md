# Talk track: Virtual Models on Vercel AI Gateway (Jarrah Insurance)

About 2.5 minutes. Fictional company, simulated numbers. Click cues are in brackets.

---

**[Step 1: The issue. Let the table load.]**

Every enterprise I talk to in ANZ now has a fleet of AI agents. This is Jarrah Insurance, a made-up insurer. Twelve agents: claims triage, fraud, call summaries, underwriting, contract review, a coding agent for the platform team.

Look at this column. Every team typed a model name straight into its own code. Five different model strings across nine repos. And Zero Data Retention, the setting that stops providers keeping your customer data, is set agent by agent. One of them doesn't have it.

About ten new models land every week. Every one is a reason to touch all twelve.

**[Click "Before: a model change". Click "Roll out the new model the old way" and let it run.]**

So a better, cheaper model comes out. Risk also says: ZDR on everything. Watch what that costs. A pull request per agent, a review, a deploy, team by team. Nineteen business days. Twelve PRs. Sixty-four engineer hours.

**[Point at the red rows.]**

And at the end? The complaints classifier is still stuck in someone's backlog. And the broker email drafter shipped without Zero Data Retention. Nobody caught it in review. That's the conversation nobody wants to have with the risk team.

**[Click "One model ID".]**

Here's what we solve. With Virtual Models on Vercel AI Gateway, the model isn't in the code any more. Every agent says one thing: vmc slash jarrah-agent. The real model, the fallbacks and Zero Data Retention all live in the gateway. Guillermo called it DNS for models. Agents keep one name, the gateway decides where it points.

**[Click "After: flip it once". Click "Switch to openai/gpt-6.1-sol".]**

Same move as before. One click in the gateway. Watch every agent pick it up. Zero pull requests, zero redeploys, not one line of agent code changed.

**[Turn on the Zero Data Retention toggle.]**

Risk wants ZDR everywhere? One switch. Twelve out of twelve.

**[Click "Send that request".]**

And this is the bit compliance teams love. Even if an agent's code asks to turn ZDR off, the virtual model wins. Governance moves out of code review and into the gateway.

**[Turn on "Simulate a provider incident".]**

Provider has a bad day? Every agent rolls to the same fallback you set centrally. Customers see nothing.

**[Click "Side by side", pause two seconds, then click "The value".]**

So for Jarrah: a model change goes from nineteen days to minutes. Ninety-six pull requests a year go to zero. Five hundred hours of engineering back on the roadmap. Every agent on Zero Data Retention, enforced, not hoped for. And moving to the cheaper model from day one is seven hundred and eighty thousand dollars a year in inference.

That's why customers love it: one central model name beats twelve agents with hardcoded strings. Your teams ship agents, your platform team governs models, and nobody does find and replace every time a new model drops.

If you've got a fleet of agents and a pile of model strings, let's talk.
