require("dotenv").config();

const log = require("./src/logger");
const { parseWorkouts } = require("./src/parseWorkouts");
const { appendWorkOutToFile } = require("./src/writeWorkouts");
const { getWorkouts } = require("./src/hevy");
const { getFileStorePath } = require("./src/files");

if (!process.env.HEVY_KEY) {
  log.error("No HEVY_KEY found");
  process.exit(1);
} else {
  log.info("HEVY_KEY found");
}

if (!process.env.HEVY_STORE) {
  log.error("No HEVY_STORE path found in environment");
  process.exit(1);
}
// HEVY_STORE must end with JSON, not JSONL
if (!process.env.HEVY_STORE.endsWith(".json")) {
  log.error(
    `HEVY_STORE path must end with .json, found: ${process.env.HEVY_STORE}`,
  );
  process.exit(1);
}

// Log the resolved file store path to help with debugging
log.info(`HEVY_STORE will be accessed at: ${getFileStorePath()}`);

const run = async () => {
  const workouts = await getWorkouts();
  if (workouts.length === 0) {
    log.info("No new workouts found, exiting");
    process.exit(0);
  }
  const parsedWorkouts = await parseWorkouts(workouts);

  // Store the parsed workout summaries
  await appendWorkOutToFile(parsedWorkouts);
};
run();
