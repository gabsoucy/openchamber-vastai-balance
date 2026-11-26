# Vast.ai Credit for OpenChamber

A small, read-only Work Status section showing available Vast.ai account credit and the GPUs you are renting. Requires OpenChamber **2.6.0 or newer**.

## Install

Install this repository as an extension from **Settings → Extensions** (for example, use the Git URL for your trusted repository), then connect Vast.ai under **Settings → Integrations → Vast.ai** with your API key. OpenChamber stores and attaches the key; the extension page never receives it. The Work Status section appears alongside chat status.

The extension makes only two read-only requests through OpenChamber's native integration API: `GET /api/v0/users/current/` for the account's `credit` field (not `balance`), and `GET /api/v0/instances/` for your instances. It does not change billing or account settings. Disconnect the account using OpenChamber's native integration controls.

Below the credit:

- **What you rent:** one line per running GPU model with its hourly price, then how many instances are stopped, for example `2 × RTX 5090 · $0.900/h` and `1 stopped`, with an open-in-new icon that opens your Vast.ai instances page.
- **Account burn rate:** the total hourly price of all running instances and roughly how long your credit lasts at that rate, for example `$0.900/h total · ~11 h of credit`. Hourly rates show three decimals. Stopped instances aren't priced.
- **Auto-top-up:** `off` when no card is on file or no top-up is set, otherwise the amount and threshold (`Auto-top-up +$25.00 below $10.00`), read from the account's `has_billing`, `autobill_amount` and `autobill_threshold`. If those fields don't clearly say either way, the line is hidden.

If the instances request fails, the section says so instead of showing zero rentals.

Credit and rentals refresh when the section opens or the account connects, when you click the round-arrows icon, and every 60 seconds while visible. Requests stop while hidden or disconnected. Failed refreshes preserve the last successful amount as stale; a missing or malformed credit is never presented as zero.

The expanded section sizes itself to its content and works at phone width. Everything is shown only while the section is expanded: OpenChamber (checked up to 2.8.0) unmounts the frame when the section is collapsed, so a collapsed summary waits for host support. Nothing is polled while collapsed.

## Development

Requires Node.js 24+ and npm.

```sh
npm ci
npm test
npm run typecheck
npm run build
```

The installable `status/main.js` bundle is committed so Git installs do not need a build step.
