# Hevy Workout Tracker

A tool for fetching and storing workout data from [www.hevy.com](https://www.hevy.com)'s API.

The core of this was written by hand, the idea was to publish workout data in between blog posts. But then I never wrote any blog posts and pivoted it towards just being a getter for my workouts, which I then upload into Claude and ask it to be my gym bro. I vibe coded using Claude Code in April some extra bits, hence why there's CLAUDE.md etc.

At some point I want to play around with it creating/updating workouts as its all a bit too manual at the moment.s

## Features

- Fetches workout data from the Hevy API
- Stores processed workout summaries as a json file
- Calculates total weight lifted and workout duration
- Delta based workout fetching.
- Converts workouts in pounds to kilograms
- Calculates bodyweight workout totals

## Setup

1. `cp .env.example .env` and fill in the blanks
2. Install dependencies: `npm i`
3. Run the application: `npm start`

## File Storage

The application stores data in:

- `HEVY_STORE` (defined in .env) - Contains processed workout summaries in a JSON array format.

## Commands

See CLAUDE.md for available commands.

## Development

- `npm format`
- Prettier / ESLint etc
- Pino
