# Virtual Models on Vercel AI Gateway: Jarrah Insurance walkthrough

A story-first, fully simulated sales walkthrough. A fictional Australian insurer runs 12 AI agents across claims, fraud, the contact centre, underwriting, legal and more, each with a model string hardcoded in its own repo. A better, cheaper model lands and risk wants Zero Data Retention everywhere: the old way is 12 pull requests, 12 deploys and 19 business days, with one agent left behind and one shipped without ZDR. With a Virtual Model (`vmc/jarrah-agent`) on Vercel AI Gateway, every agent uses one ID; the platform team changes the model, fallbacks and ZDR once in the gateway, and every agent follows with no code change or redeploy.

- Live: https://virtual-models-walkthrough.vercel.app
- `TALK_TRACK.md`: 2 to 3 minute spoken script with click cues
- `LINKEDIN_CAPTION.md`: post copy
- Deep links: `/#1` to `/#6`; arrow keys move between steps

Everything runs client-side. No API keys, no secrets, the gateway is simulated. Jarrah Insurance is fictional; agents, volumes, spend, hours and timelines are simulated example figures.

Product background: Introducing Virtual Models on AI Gateway (28 Oct 2026), https://vercel.com/blog/ai-gateway-virtual-models

```bash
npm install
npm run dev
```
