require("dotenv").config();
const log = require("../logger");

const fs = require("fs").promises;
const path = require("path");

// check if FILE_STORE exists and return metadata
const checkFileStore = async () => {
  const FILE_STORE = path.join(process.cwd(), process.env.HEVY_STORE);

  try {
    await fs.access(FILE_STORE);
    log.info(`File store found at ${FILE_STORE}`);
  } catch (err) {
    log.info(`File store not found at ${FILE_STORE}`);
    return {
      exists: false,
      firstWorkout: process.env.START_DATE,
      lastWorkout: process.env.START_DATE,
    };
  }

  const fileContent = await fs.readFile(FILE_STORE, "utf8");
  if (!fileContent.trim()) {
    return {
      exists: true,
      firstWorkout: process.env.START_DATE,
      lastWorkout: process.env.START_DATE,
    };
  }

  try {
    const workouts = JSON.parse(fileContent);

    if (!Array.isArray(workouts) || workouts.length === 0) {
      return {
        exists: true,
        firstWorkout: process.env.START_DATE,
        lastWorkout: process.env.START_DATE,
      };
    }

    const firstWorkout = workouts[0];
    const lastWorkout = workouts[workouts.length - 1];

    const metadata = {
      exists: true,
      firstWorkout: new Date(firstWorkout.start_time).toISOString(),
      lastWorkout: new Date(lastWorkout.start_time).toISOString(),
    };

    log.info(`File store metadata: ${JSON.stringify(metadata)}`);
    log.info(`Last workout found: ${metadata.lastWorkout}`);
    return metadata;
  } catch (err) {
    log.error(`Error parsing JSON for metadata: ${err.message}`);
    return {
      exists: true,
      firstWorkout: process.env.START_DATE,
      lastWorkout: process.env.START_DATE,
    };
  }
};

module.exports = {
  checkFileStore,
};
