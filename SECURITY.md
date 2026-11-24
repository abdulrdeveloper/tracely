# Security Policy

Tracely handles people's live location, so we take security reports seriously.

## Supported versions

Only the latest commit on `main` is supported. Fixes are not back-ported.

## Reporting a vulnerability

**Please do not open a public issue, discussion or pull request for security
problems.**

Report privately using GitHub's
[private vulnerability reporting](../../security/advisories/new)
(Security tab, then *Report a vulnerability*) on this repository.

Please include:

- A description of the issue and its impact.
- Steps to reproduce, or a proof of concept.
- The affected event, file or commit if you know it.
- Any suggested fix.

## What to expect

- We aim to acknowledge your report within **3 business days**.
- We aim to share an assessment and plan within **10 business days**.
- We will keep you updated, and credit you in the fix unless you prefer to stay
  anonymous.

## Scope

In scope:

- Handling of the `client:location:update` event and validation of its data.
- Processing of Kafka messages in `index.js` and `database-processor.js`.
- Anything that lets one browser run script in another browser (for example
  through marker popups).
- What is written to MongoDB.
- Dependencies with a known vulnerability that affects Tracely.

Out of scope:

- Social engineering and phishing.
- Denial of service by volume.
- Issues in third-party services (MongoDB Atlas, OpenStreetMap, hosting
  providers).
- Findings that require a compromised device.
- Insecure configuration of a deployment, for example a committed `.env` file
  or Kafka exposed to the internet.
- Features on the roadmap, such as sign-in and rate limiting. Ideas for them
  are welcome as feature requests.

## Good-faith research

If you act in good faith, avoid accessing other people's data, and give us
reasonable time to fix the issue before disclosure, we will not pursue action
against you.

## Recommended setup for your own copy

- The provided `docker-compose.yml` is for local development. It publishes
  Kafka on port `9092` and runs Kafka UI on port `8080` without a login. Keep
  both on your machine or a private network.
- Keep `.env` out of git. It can contain your MongoDB password.
- Tracely has no sign-in yet, so anyone who can open the page sees every
  rider. Add authentication before you share a copy more widely.
- Browsers share location only on `localhost` or HTTPS. Put a TLS-terminating
  proxy in front of the server.
- Keep dependencies up to date.

## For contributors

- Never commit secrets (`.env` files, database URIs, API keys).
- If you accidentally commit a secret, tell a maintainer immediately so it can
  be rotated. Removing it in a later commit does not make it safe.
