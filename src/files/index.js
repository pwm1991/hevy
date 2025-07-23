require('dotenv').config();
const log = require('../logger');

const fs = require('fs').promises;
const path = require('path');

const getFileStorePath = () => {
  return path.join(process.cwd(), process.env.HEVY_STORE);
};

const noFileStoreDefault = () => ({
  lastWorkout: process.env.START_DATE,
});

const checkFileStore = async () => {
  const FILE_STORE = getFileStorePath();

  try {
    await fs.access(FILE_STORE);
    log.info(`File store found at ${FILE_STORE}`);
  } catch (err) {
    log.info(`File store not found at ${FILE_STORE}`);
    return noFileStoreDefault();
  }

  try {
    const fileContent = await fs.readFile(FILE_STORE, 'utf8');
    const workouts = JSON.parse(fileContent);

    if (!Array.isArray(workouts) || workouts.length === 0) {
      return noFileStoreDefault();
    }

    let lastWorkout = new Date(workouts[0].date);
    lastWorkout.setHours(lastWorkout.getHours() + 1);
    const metadata = {
      lastWorkout: lastWorkout.toISOString(),
    };

    log.info(`File store metadata: ${JSON.stringify(metadata)}`);
    return metadata;
  } catch (err) {
    log.error(`Error parsing JSON for metadata: ${err.message}`);
    return noFileStoreDefault();
  }
};

module.exports = {
  checkFileStore,
  getFileStorePath,
};
