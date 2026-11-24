# Support

Tracely is an independent open-source project. If something is unclear or does
not work as expected, help is available.

## Before asking for help

Please check:

- The setup and configuration steps in [README.md](README.md) and the design
  notes in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and pull request guidance.
- [SECURITY.md](SECURITY.md) for security vulnerabilities. Do not post them
  publicly.
- Existing [issues](../../issues), in case someone already asked.

## Common problems

- **The server exits with `ECONNREFUSED 127.0.0.1:9092`:** Kafka is not running.
  Start it with `docker compose up -d` and wait a few seconds before starting
  the server.
- **The map shows only me:** other riders appear after their next update, which
  can take up to 10 seconds. Check that the other window allowed location
  access.
- **No marker for my own position:** the browser blocked location access, or
  the page is not on `localhost` or HTTPS. Geolocation does not work on plain
  HTTP from another device. The browser console shows the reason.
- **Markers stop moving after Kafka restarted:** the server's Kafka consumer
  can stop when Kafka's group coordinator is briefly unavailable. Restart the
  server.
- **`database-processor` exits with "Missing MONGO_URI":** set `MONGO_URI` in
  `.env`. The live map does not need MongoDB.
- **`EADDRINUSE`:** port 8000 is taken. Set `PORT` in `.env`.
- **Kafka UI does not open:** it listens on <http://localhost:8080> and starts
  with the rest of `docker compose up -d`.

## How to get help

Open an [issue](../../issues/new) and include:

- A short description of the problem.
- Steps to reproduce it.
- What you expected to happen and what happened instead.
- Your Node.js and pnpm versions, operating system and browser.
- Error messages or screenshots.

Remove passwords, database URIs, real coordinates and personal data before you
post anything. Never share your `.env` file.

## Response expectations

Support is handled as capacity allows and does not guarantee an immediate
response. Security reports follow the timelines in [SECURITY.md](SECURITY.md).

## Feature requests

Feature ideas are welcome. Strong requests explain the problem, who benefits,
and the proposed outcome. Tracely stays deliberately small, so requests are
weighed against simplicity and maintenance cost.

## Your own deployment

If you run Tracely for other people, you are responsible for supporting them
and for the location data they share. The maintainer can help with the project
itself, but not with your hosting, data or users.
