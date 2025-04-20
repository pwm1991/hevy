# Hevy Workout Tracker

A tool for fetching and storing workout data from the Hevy API.

## Features

- Fetches workout data from the Hevy API
- Stores both raw API response data and processed workout summaries
- Tracks the latest workout timestamp to only fetch new workouts
- Calculates total weight lifted and workout duration
- Sorts workouts by start time

## Setup

1. Create a `.env` file with the following variables:

   ```
   HEVY_KEY=your_hevy_api_key
   HEVY_STORE=path/to/store/workouts.jsonl
   START_DATE=2023-01-01T00:00:00Z
   HEVY_PAGE_LIMIT=10
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the application:
   ```
   npm start
   ```

## File Storage

The application stores data in two files:

- `HEVY_STORE` (defined in .env) - Contains processed workout summaries
- `raw_[HEVY_STORE]` - Contains the raw API response data

Both files use JSONL format (one JSON object per line).

## Commands

See CLAUDE.md for available commands.
