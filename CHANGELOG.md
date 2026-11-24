# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-11-24

First public version.

### Added

- Live map with one marker per connected rider (Leaflet and OpenStreetMap).
- Browser client that sends its position on page load and every 10 seconds.
- Socket.IO server that validates updates, publishes them to Kafka and
  broadcasts what Kafka delivers.
- Kafka client, topic setup script and Docker Compose file (Kafka in KRaft mode
  and Kafka UI).
- Database processor that saves every update to MongoDB.
- `/health` endpoint.
- README, architecture notes, contributing guide, code of conduct, security
  policy, support guide and privacy policy.
- Invalid coordinates are rejected before they reach Kafka.
- Kafka send errors and invalid Kafka messages are logged instead of crashing
  the server.
- Markers are removed from other maps when a rider disconnects.
- A failed MongoDB write is retried by Kafka instead of being lost.
