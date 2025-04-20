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
    await sortFileStore(FILE_STORE);
  } catch (err) {
    log.error(`File store not found at ${FILE_STORE}`);
    return {
      exists: false,
      firstWorkout: process.env.START_DATE,
      lastWorkout: process.env.START_DATE,
    };
  }

  const fileContent = await fs.readFile(FILE_STORE, "utf8");

  const lines = fileContent.trim().split("\n");
  if (lines.length === 0) {
    return {
      exists: true,
      firstWorkout: process.env.START_DATE,
      lastWorkout: process.env.START_DATE,
    };
  }

  const firstLine = lines[0];
  const lastLine = lines[lines.length - 1];
  const FILE_STORE_META = {
    exists: true,
    firstWorkout: new Date(JSON.parse(firstLine).start_time).toISOString(),
    lastWorkout: new Date(JSON.parse(lastLine).start_time).toISOString(),
  };
  log.info(`File store metadata: ${JSON.stringify(FILE_STORE_META)}`);
  log.info(`Last workout found: ${FILE_STORE_META.lastWorkout}`);
  return FILE_STORE_META;
};

const sortFileStore = async (filePath) => {
  try {
    // Check if file exists and has content
    const stats = await fs.stat(filePath);
    if (stats.size === 0) {
      log.info(`File ${filePath} is empty, skipping sort`);
      return;
    }

    const data = await fs.readFile(filePath, "utf8").then((data) => {
      const trimmed = data.trim();
      return trimmed ? trimmed.split("\n").map(JSON.parse) : [];
    });

    if (data.length === 0) {
      log.info(`No data in ${filePath}, skipping sort`);
      return;
    }

    // Find the start_time field (might be directly or in workout.start_time)
    const getStartTime = (item) => {
      if (item.start_time) {
        return new Date(item.start_time);
      } else if (item.workout && item.workout.start_time) {
        return new Date(item.workout.start_time);
      }
      return new Date(0); // fallback
    };

    const sortedData = data.sort((a, b) => {
      return getStartTime(a) - getStartTime(b);
    });

    const sortedJsonl = sortedData
      .map((item) => JSON.stringify(item))
      .join("\n");

    await fs.writeFile(filePath, sortedJsonl, "utf8");
    log.info(`File store sorted by start_time: ${filePath}`);
  } catch (err) {
    log.error(`Error sorting file store ${filePath}: ${err}`);
  }
};

module.exports = {
  checkFileStore,
};
