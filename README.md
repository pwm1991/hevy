# Hevy Workout Tracker

A tool for fetching and storing workout data from the Hevy API using Claude Code aka vibez.

## Features

- Fetches workout data from the Hevy API
- Stores processed workout summaries
- Tracks the latest workout timestamp to only fetch new workouts
- Calculates total weight lifted and workout duration
- Sorts workouts by start time
- Uploads workout data to Claude Project for analysis

## Setup

1. Create a `.env` file with the following variables:

   ```
   HEVY_KEY=your_hevy_api_key
   HEVY_STORE=path/to/store/workouts.json
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

The application stores data in:

- `HEVY_STORE` (defined in .env) - Contains processed workout summaries in a JSON array format.

## Commands

See CLAUDE.md for available commands.

## Development

### Code Formatting

This project uses Prettier for code formatting. A pre-push git hook has been set up to automatically:

1. Check if files being pushed need formatting
2. Run the formatter if needed
3. Commit the formatted files automatically
4. Continue with the push

You can also manually format code at any time with:

```
npm run format
```
