require('dotenv').config();

const log = require('./src/logger');
const { parseWorkouts } = require('./src/parseWorkouts');
const { appendWorkOutToFile } = require('./src/writeWorkouts');
const { getWorkouts } = require('./src/hevy');

if (!process.env.HEVY_KEY) {
    log.error('No HEVY_KEY found');
    process.exit(1);
}
log.info('HEVY_KEY found');

const run = async () => {
    const workouts = await getWorkouts();
    if (workouts.length === 0) {
        log.info('No new workouts found, exiting');
        process.exit(0);
    }
    const parsedWorkouts = await parseWorkouts(workouts);
    await appendWorkOutToFile(parsedWorkouts);
};

run();
