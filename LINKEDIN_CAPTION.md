# LinkedIn caption

Twelve AI agents. Twelve model names typed straight into the code.

That's what I see in most enterprise AI estates right now. Then a better, cheaper model lands (about ten a week now) or risk says "Zero Data Retention on everything", and it becomes twelve pull requests, twelve deploys and three or four weeks of chasing teams. Usually one agent gets missed.

In this walkthrough, a fictional Australian insurer goes from 19 business days to minutes for a model change:

→ Every agent calls one virtual model ID on Vercel AI Gateway
→ The platform team changes the model once, and every agent follows. No code change, no redeploy
→ Fallbacks and Zero Data Retention are set centrally, and an agent can't switch them off
→ Simulated: 96 PRs a year to zero, 500+ engineer hours back, A$780k a year from moving to the cheaper model on day one

Guillermo Rauch called it "DNS for models". Model governance moves out of code review and into the gateway.

Try it yourself: https://virtual-models-walkthrough.vercel.app

How many hardcoded model strings are in your agents today?

#Vercel #AIGateway #AIAgents #PlatformEngineering #ANZ
