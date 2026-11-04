# Vast.ai Credit for OpenChamber

A small, read-only Work Status section showing available Vast.ai account credit. Requires OpenChamber **2.6.0 or newer**.

## Install

Install this repository as an extension from **Settings → Extensions** (for example, use the Git URL for your trusted repository), then connect Vast.ai under **Settings → Integrations → Vast.ai** with your API key. OpenChamber stores and attaches the key; the extension page never receives it. The Work Status section appears alongside chat status.

The extension makes only `GET /api/v0/users/current/` requests through OpenChamber's native integration API. It displays the account's `credit` field, not `balance`. It does not change billing or account settings. Auto-top-up is not displayed because the available fields do not establish whether the feature is enabled. Disconnect the account using OpenChamber's native integration controls.

Credit refreshes when the section opens or the account connects, on request with **Refresh**, and every 60 seconds while visible. Requests stop while hidden or disconnected. Failed refreshes preserve the last successful amount as stale; a missing or malformed credit is never presented as zero.

The expanded section sizes itself to its content. Credit is shown only while expanded: OpenChamber 2.6.0 unmounts the frame and removes its header controls when collapsed. A collapsed amount is deferred until the host supports it. The extension does not keep polling while collapsed.

## Development

Requires Node.js 24+ and npm.

```sh
npm ci
npm test
npm run typecheck
npm run build
```

The installable `status/main.js` bundle is committed so Git installs do not need a build step.
