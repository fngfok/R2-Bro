# 🤖 R2 Bro

**R2 Bro** is your ultimate astromech companion for *Star Wars: Galaxy of Heroes* (SWGOH). Built to help you make the right strategic decisions, this tool analyzes rosters and stats to give you the upper hand in Territory Wars (TW), Grand Arena Championships (GAC), and Squad Arena.

---

## 🌟 Features

* **GAC & TW Matchup Analysis:** Compare rosters and get data-driven recommendations for offense and defense.
* **Arena Tracking:** Monitor your shard and plan your climbs.
* **Lightning Fast:** Utilizes local caching (`node-cache`) to ensure rapid load times without constantly hitting the SWGOH servers.
* **Accurate Game Data:** Powered directly by the game's client API via `swgoh-comlink` and deep statistical analysis via `swgoh-stats`.

---

## 🛠️ Tech Stack

**Frontend & Server**
* [ExpressJS](https://expressjs.com/) - Fast, unopinionated web framework for Node.js
* [EJS](https://ejs.co/) - Embedded JavaScript templating for the UI
* [node-cache](https://www.npmjs.com/package/node-cache) - In-memory caching to optimize API calls
* [@swgoh-utils/comlink](https://www.npmjs.com/package/@swgoh-utils/comlink) - Wrapper to call commlink et stats

**Data Layer (Docker)**
* [`swgoh-comlink`](https://github.com/swgoh-utils/swgoh-comlink) - Local proxy to the SWGOH game servers
* [`swgoh-stats`](https://github.com/swgoh-utils/swgoh-stats) - Local service for calculating accurate unit stats

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [Docker](https://www.docker.com/) and Docker Compose (to run the SWGOH data services)

---

## 🚀 Installation & Setup

### 1. Start the Data Services
R2 Bro relies on local instances of `swgoh-comlink` and `swgoh-stats` to fetch and calculate game data. The easiest way to run these is via Docker Compose.

Create a `docker-compose.yml` file in your root directory (or run them manually):

```yaml
version: '3.8'
services:
  swgoh-comlink:
    image: ghcr.io/swgoh-utils/swgoh-comlink:latest
    ports:
      - "3000:3000"
    environment:
      - ACCESS_KEY=${COMLINK_ACCESS_KEY}
      - SECRET_KEY=${COMLINK_SECRET_KEY}
    restart: always

  swgoh-stats:
    image: ghcr.io/swgoh-utils/swgoh-stats:latest
    ports:
      - "3223:3223
    env:
      - PORT=3223
      - CLIENT_URL=http://swgoh-comlink:3000
      - ACCESS_KEY=${COMLINK_ACCESS_KEY}
      - SECRET_KEY=${COMLINK_SECRET_KEY}
    restart: always
