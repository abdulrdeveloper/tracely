# Contributing to Tracely

Thanks for helping make Tracely better. This guide explains how to set up the
project, how we work, and what a good pull request looks like.

By participating you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
Contributions are released under the project's [MIT License](LICENSE).

## Ways to contribute

- Report a bug or suggest a feature by opening an issue.
- Improve documentation or fix typos.
- Pick up an open issue.
- Review open pull requests.

For anything security related, do **not** open a public issue. See
[SECURITY.md](SECURITY.md).

## Development setup

Requirements: Node.js (the project is developed on v24), pnpm 11
(`corepack enable` sets it up) and Docker with Docker Compose. A MongoDB
database is only needed if you work on `database-processor.js`. The
[README](README.md) explains the full setup.

```bash
git clone https://github.com/abdulrdeveloper/tracely.git
cd tracely
pnpm install
cp .env.example .env

docker compose up -d       # Kafka + Kafka UI
node kafka-admin.js        # creates the location-updates topic
pnpm dev                   # http://localhost:8000
```

Never commit `.env` files.

To test with more than one rider, open the page in two or three browser
windows. In Chrome DevTools, **More tools → Sensors → Location** lets each
window pretend to be somewhere else.

## Workflow

1. **Open or find an issue first** for anything bigger than a small fix, so we
   can agree on the approach before you spend time on it.
2. **Fork** the repository and create a branch from `main`. Nobody pushes
   directly to `main`; every change goes through a pull request.
3. Use a descriptive branch name: `feat/short-name`, `fix/short-name`,
   `docs/short-name`, `chore/short-name`.
4. Keep the change focused. One pull request should do one thing.
5. Run the checks below and make sure they pass.
6. Open a pull request against `main`.

## Checks

```bash
for f in index.js database-processor.js kafka-client.js kafka-admin.js models/Location.js public/script.js; do
  node --check "$f"
done
```

Describe in the pull request how you tested your change, for example: "opened two windows, moved one, saw the
marker move in the other, closed it and saw the marker disappear". An
automated test setup would be a very welcome contribution.

## Commit messages

Write short, imperative messages that explain the change, for example
`fix: ignore location updates with invalid coordinates`. We use
[Conventional Commits](https://www.conventionalcommits.org/) prefixes
(`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).

## Pull request checklist

- [ ] The change is focused and the description explains *why*.
- [ ] The syntax checks above pass.
- [ ] You describe how you tested the change.
- [ ] Docs are updated if behaviour, configuration or setup changed.
- [ ] No secrets, personal data or `.env` files are included.
- [ ] UI changes include a screenshot.

## Code style

- Plain JavaScript with ES modules. There is no build step.
- Follow the existing structure: server code in the project root, the browser
  UI in `public/`, the Mongoose model in `models/`.
- Validate everything that comes from a browser on the server. Never trust the
  client.
- Errors from Kafka or MongoDB should be handled and logged, not left as
  unhandled rejections that crash the process.
- Keep the project small. New features should be useful to most people who
  run Tracely, and new dependencies need a good reason.

## Review

A maintainer will review your pull request as soon as they can. Please be
patient and responsive to feedback. Maintainers may ask for changes, or close a
pull request that is out of scope; this is never personal.

## Questions

Open an issue, or see [SUPPORT.md](SUPPORT.md).
