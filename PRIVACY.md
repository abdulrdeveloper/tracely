# Privacy Policy

**Last updated: November 24, 2026**

Tracely is a free, open-source live location tracking project. There is no
hosted version run by the maintainer. This document explains what information
the software handles when **you** run it, so you can inform the people who use
your copy.

## Who this covers

If you run Tracely, you are the operator. You are responsible for telling your
users what is collected, for the data stored in your Kafka and MongoDB, and for
the services you connect. You may adapt this file as a starting point.

## Information Tracely handles

- **Location:** latitude and longitude from the browser's Geolocation API, sent
  about every 10 seconds while the page is open, and only after the user
  allows location access in the browser.
- **Rider id:** the Socket.IO connection id. It changes on every page load and
  is not linked to a name, email or account.
- **Time:** the time a location was saved in MongoDB.

Tracely has no accounts, passwords, cookies or analytics.

## Who can see a location

Every location update is shared with **every browser that has the page open**,
together with the rider id. Tracely has no sign-in yet, so anyone who can open
your copy sees everyone connected to it. Share your copy only with people who
are happy to see each other's position.

## Where it is stored

- **Kafka:** each update is a message on the `location-updates` topic. Kafka
  keeps messages according to its retention settings (7 days by default).
- **MongoDB:** `database-processor.js` saves each update (rider id, latitude,
  longitude and timestamps). The records stay until you delete them, so you
  decide how long they are kept.
- **Server memory:** the server does not keep positions in memory. A rider's
  marker disappears from other maps when their connection closes.

Do not run the processor if you do not want location history.

## Third-party services in the browser

- The map tiles come from **OpenStreetMap** (`tile.openstreetmap.org`). Their
  servers see the viewer's IP address and the map area being viewed.
- The Leaflet library is loaded from **unpkg.com**.

These services process information under their own policies.

## Deleting data

To delete stored locations, delete the documents from the `locations`
collection in MongoDB, and delete or let expire the Kafka topic data. To remove
a person's records, search by the rider id.

## Children

Tracely is not directed at children. Do not use it to track the location of
anyone who has not agreed to it.

## Changes to this policy

This policy may change as the project changes. The updated version will be
published in this file with a revised date.

## Contact

For privacy questions about the project, follow the steps in
[SUPPORT.md](SUPPORT.md).
