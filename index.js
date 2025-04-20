require('dotenv').config();

const log = require('./src/logger');
const { parseWorkouts } = require('./src/parseWorkouts');
const { appendWorkOutToFile } = require('./src/writeWorkouts');
const { getWorkouts } = require('./src/hevy');
const { getFileStorePath } = require('./src/files');

// Print .dotenv variables for debugging
if (!process.env.HEVY_STORE) {
  process.exit(1);
}

const run = async () => {
  const workouts = await getWorkouts();
  if (workouts.length === 0) {
    log.info('No new workouts found, exiting');
    process.exit(0);
  }
  const parsedWorkouts = await parseWorkouts(workouts);

  // Store the parsed workout summaries
  await appendWorkOutToFile(parsedWorkouts);
};
run();
