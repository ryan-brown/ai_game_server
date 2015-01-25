# ai_game_server
AI Game Web Server

## Getting Started

```bash
git submodule init
npm install
node index.js
```

## Overview

This is a very basic server running vanilla Node.

### `GET /`

This a just a boring old home page. No real functionality.

### `GET /rules`

A basic page with all the rules and guidelines for the competition.

### `GET /submit`

This page has some final guidelines for the AI competition, but mainly it's just an `input` for the player's name and a `textarea` for the code. This form posts to `/code`.

### `GET /games`

This page shows the results of all the runs of the games in the database.

### `GET /games/:id`

This page shows a playback of a specific game. Every game run gets a unique id.

### `POST /code`

This route is how players submit bot code into the system. It expects a payload of JSON in the form `{ player : <string>, code: <string> }`

The response from the server is intended for error reporting. It is in the following form `{ message: <string> }`, the HTTP status code is also meaningful, and intuitive. Status code 200 is the only code which means success.

### `POST /run`

This route is how we can kick of runs of the system.

TODO: What options for running do we want? Round Robin on everyone, specific player vs player?