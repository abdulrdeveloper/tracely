<p align="center">
  <img src="public/logo.svg" alt="Tracely" height="120" />
</p>

<h3 align="center">Real-time live location tracking on a map, built on Socket.IO, Apache Kafka and MongoDB.</h3>

<p align="center">
  Open Tracely, allow location access, and you appear on a shared map. Everyone else who has the page open shows up as a marker and moves in real time. Every update travels through a Kafka topic, so the live map and the database are fed by independent consumers.
</p>

<p align="center">
  <a href="#run-it-yourself"><strong>Run it</strong></a>
  ·
  <a href="#screenshots">Screenshots</a>
  ·
  <a href="docs/ARCHITECTURE.md">Architecture</a>
  ·
  <a href="https://github.com/abdulrdeveloper/tracely/issues">Report a bug</a>
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-24-5FA04E.svg" />
  <img alt="Express 5" src="https://img.shields.io/badge/Express-5-black.svg" />
  <img alt="Socket.IO 4" src="https://img.shields.io/badge/Socket.IO-4-010101.svg" />
  <img alt="Apache Kafka" src="https://img.shields.io/badge/Apache%20Kafka-4.2-231F20.svg" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg" />
  <a href="CONTRIBUTING.md"><img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
</p>

<p align="center">
  <img src="docs/images/hero.jpg" alt="Tracely: live map of riders on a desktop browser and a phone" />
</p>

---

## What is Tracely?

Live location features (delivery tracking, ride sharing, "where is my friend")
all follow the same pattern: many devices send positions, many screens show
them, and you probably want to keep a history. Tracely is a small, readable
example of that pattern.

- **Browser:** plain HTML and JavaScript with Leaflet and OpenStreetMap tiles.
- **Server:** Node.js, Express 5 and Socket.IO.
- **Pipeline:** a Kafka topic between the socket server and everything else.
- **History:** a separate consumer that saves every update to MongoDB.

It is focused on one thing done clearly: positions in, markers out. Accounts,
rooms and routing are not included. See [Known limitations](#known-limitations).

> Tracely is a learning and open-source project. It is **not deployed**, and it
> has no authentication, so do not run it for real users as it is.
> The images below come from a local run with ten fake riders placed around
> Lahore.

## Screenshots

### Live map

Every connected rider is a marker. Markers move as updates arrive and
disappear when a rider leaves.

![Live map with ten riders across the city](docs/images/live-map.jpg)

### Street level

Click a marker to see the rider id.

![Street level view with a rider popup](docs/images/street-view.jpg)

### On a phone

![The map on two phone-sized screens](docs/images/mobile.jpg)

### Kafka

Every update is a message on the `location-updates` topic, keyed by the
rider's socket id. This is [Kafka UI](https://github.com/provectus/kafka-ui),
included in the Docker Compose file.

![Kafka UI showing messages on the location-updates topic](docs/images/kafka-messages.jpg)

### Server logs

![Terminal output of the socket server receiving updates from Kafka](docs/images/terminal-server.jpg)

## Features

### Live map
- One marker per connected rider, with the rider id in a popup.
- Your own marker says "You are here". The map centres on you and follows you
  as you move.
- Your position is sent as soon as the page loads, then every 10 seconds.
- A rider's marker is removed from every map when they disconnect.
- Works on phones and tablets (the map fills the screen).

### Kafka pipeline
- Updates are published to a Kafka topic with the socket id as the key, so
  each rider's updates stay in order.
- The socket server and the database processor are separate consumer groups,
  so either can be slow or stopped without affecting the other.
- Kafka and Kafka UI start with one `docker compose up -d`.

### Saved history
- `database-processor.js` writes every update to MongoDB with Mongoose.
- If MongoDB is down, Kafka redelivers the message instead of losing it.
- Bad data (invalid JSON or a validation error) is logged and skipped.

### Careful by default
- The server rejects coordinates that are not numbers or are outside the valid
  range before they reach Kafka.
- Errors from Kafka are logged and do not crash the server.
- `GET /health` for a quick status check.

## How it works

![Tracely architecture: browsers, socket server, Kafka, database processor and MongoDB](docs/images/architecture.jpg)

1. **Send:** the browser reads its position and emits `client:location:update`.
2. **Publish:** the server validates it and publishes it to the Kafka topic
   `location-updates`.
3. **Broadcast:** the server's own consumer reads the topic and emits
   `server:location:update` to every browser.
4. **Save:** the database processor reads the same topic and stores each update
   in MongoDB.
5. **Leave:** when a socket disconnects, the server emits
   `server:location:remove` and every browser removes that marker.

The full design, including Kafka settings and failure behaviour, is in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Run it yourself

### You need

- **Node.js 24** and **pnpm 11** (`corepack enable` sets up pnpm)
- **Docker** with Docker Compose, for Kafka and Kafka UI
- A **MongoDB** database, only if you want to save history. A free
  [Atlas](https://www.mongodb.com/cloud/atlas/register) cluster or a local
  `mongodb://127.0.0.1:27017/tracely` works. The live map does not need it.

### Quick start

```bash
git clone https://github.com/abdulrdeveloper/tracely.git
cd tracely
pnpm install
cp .env.example .env

docker compose up -d      # Kafka on :9092 and Kafka UI on :8080
node kafka-admin.js       # creates the location-updates topic (2 partitions)
pnpm dev                  # map and socket server on http://localhost:8000
```

Open **http://localhost:8000** and allow location access.

To save history, set `MONGO_URI` in `.env` and run this in a second terminal:

```bash
pnpm dev:db
```

### Try it with more than one rider

Every browser tab is its own rider. Open the page in two or three windows. To
fake different places, use Chrome DevTools: **More tools → Sensors →
Location**. Each window shows up on the others within 10 seconds.

### Configuration

Set these in `.env` (see `.env.example`):

| Variable | Required | What it is |
| --- | --- | --- |
| `PORT` | No | Port of the web and socket server, default `8000` |
| `NODE_ENV` | No | Shown in the startup log |
| `MONGO_URI` | Only for `database-processor.js` | MongoDB connection string |

Never commit `.env` files.

### Make it yours

| What | Where |
| --- | --- |
| How often a position is sent (10 seconds) | `main()` in `public/script.js` |
| Default map view and tile source | Top of `public/script.js` |
| Geolocation accuracy and timeout | `getUsersCurrentLocation()` in `public/script.js` |
| Marker popups | `public/script.js` |
| Kafka address (`localhost:9092`) | `kafka-client.js` |
| Topic name and partition count | `kafka-admin.js`, plus the topic name in `index.js` and `database-processor.js` |
| Kafka and Kafka UI containers | `docker-compose.yml` |
| Saved fields | `models/Location.js` |

### Deploying

Tracely is not deployed, and it is not ready for real users. If you want to
host it anyway, you need:

- A host that keeps long-lived connections open. Serverless functions do not
  fit Socket.IO and a Kafka consumer.
- HTTPS. Browsers only share location on `localhost` or HTTPS.
- A Kafka broker the server can reach, and a change in `kafka-client.js` to
  point at it.
- Authentication in front of the page. Without it everyone sees everyone.
- Kafka and Kafka UI **not** open to the internet. The provided Compose file is
  for local development and Kafka UI has no login.

See [SECURITY.md](SECURITY.md) and [PRIVACY.md](PRIVACY.md) before you share it
with other people.

## Socket.IO events and HTTP

| Event | Direction | Payload |
| --- | --- | --- |
| `client:location:update` | browser → server | `{ latitude, longitude }` |
| `server:location:update` | server → browsers | `{ id, latitude, longitude }` |
| `server:location:remove` | server → browsers | `id` of the rider that left |

| Method | Route | What it does |
| --- | --- | --- |
| `GET` | `/health` | Returns `{ "healthy": true, ... }` for status checks |
| `GET` | `/` | Serves the map from `public/` |

## Tech stack

| Area | Tools |
| --- | --- |
| Server | Node.js, Express 5, Socket.IO 4 |
| Messaging | Apache Kafka 4.2 (KRaft, single broker) with `kafkajs` |
| Database | MongoDB with Mongoose |
| Frontend | HTML, CSS and JavaScript, Leaflet 1.9, OpenStreetMap tiles |
| Tooling | pnpm, Docker Compose, Kafka UI |

## Useful commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the server and restart it when files change |
| `pnpm dev:db` | Start the database processor with file watching |
| `pnpm start` | Start the server |
| `pnpm processor` | Start the database processor |
| `node kafka-admin.js` | Create the `location-updates` topic |
| `docker compose up -d` / `down` | Start or stop Kafka and Kafka UI |

## Project layout

```text
index.js                 Express + Socket.IO server, Kafka producer and consumer
database-processor.js    Kafka consumer that saves updates to MongoDB
kafka-client.js          Shared Kafka client config
kafka-admin.js           Creates the location-updates topic
models/Location.js       Mongoose schema
public/                  Map UI: index.html, script.js, style.css, logo
docs/                    Architecture notes and README images
docker-compose.yml       Kafka (KRaft) and Kafka UI
.github/                 Issue and pull request templates
```

## Project status

The whole flow (browser, Socket.IO, Kafka, MongoDB and back to other browsers)
was run end to end locally with ten simultaneous riders. There are no
automated tests in the repository yet.

### Known limitations

- **No authentication.** Anyone who opens the page sees every rider.
- **No rate limiting** on location updates.
- **Rider ids are socket ids.** A page refresh creates a new rider. The old
  marker is removed when the old connection closes.
- **New visitors see others late.** A rider appears on a new visitor's map
  after that rider's next update, which can take up to 10 seconds.
- **Restarts replay missed updates.** The socket server resumes from its last
  committed Kafka offset, so riders can briefly appear at old positions.
- **A Kafka hiccup stops the server.** If Kafka's group coordinator is briefly
  unavailable, the server's consumer crashes. The server logs
  `KafkaConsumer crashed` and exits, so start it again. (Under `pnpm dev` it
  waits for the next file change.)
- **Disconnects reach only the server that owned the socket.** Running several
  server instances needs more work.
- **Saved locations are never deleted.**
- **Kafka address and topic name are fixed** in the code.
- The topic only gets 2 partitions if you run `node kafka-admin.js` before the
  server. Otherwise Kafka creates it with 1.

## Contributing

Contributions are welcome, from typo fixes to new features. Please read
[CONTRIBUTING.md](CONTRIBUTING.md) and follow our
[Code of Conduct](CODE_OF_CONDUCT.md). Every change goes through a pull request.

Need help? See [SUPPORT.md](SUPPORT.md). Changes are listed in
[CHANGELOG.md](CHANGELOG.md).

## Security

Found a vulnerability? Please report it privately as described in
[SECURITY.md](SECURITY.md) instead of opening a public issue.

## Policies

- [Privacy Policy](PRIVACY.md)

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Abdul Rahman.
