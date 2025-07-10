const log = require('../logger');
const fs = require('fs').promises;
const { getFileStorePath } = require('../files');

const appendWorkOutToFile = async (processedWorkouts) => {
  // Store processed summaries using consistent path resolution
  const summaryTarget = getFileStorePath();
  log.info(`Updating workout summaries in file: ${summaryTarget}`);

  if (!Array.isArray(processedWorkouts)) {
    log.error('processedWorkouts is not an array');
    return;
  }

  // If there are no new workouts to add, we can skip
  if (processedWorkouts.length === 0) {
    log.info('No new workouts to add, skipping file update');
    return;
  }

  // Read existing data from file
  let existingWorkouts = [];
  try {
    try {
      await fs.access(summaryTarget);
      const fileContent = await fs.readFile(summaryTarget, 'utf8');
      if (fileContent.trim()) {
        try {
          existingWorkouts = JSON.parse(fileContent);
          if (!Array.isArray(existingWorkouts)) {
            log.error('Existing file content is not a JSON array');
            existingWorkouts = [];
          }
        } catch (parseErr) {
          log.error(`Error parsing JSON: ${parseErr.message}`);
          existingWorkouts = [];
        }
      }
    } catch (accessErr) {
      log.info(`File ${summaryTarget} does not exist, will create it`);
    }
  } catch (err) {
    log.info('Could not read existing file, initializing as empty array');
  }

  // Combine existing and new workouts
  const allWorkouts = [...existingWorkouts, ...processedWorkouts];

  // Sort by startTime if available
  const getStartTime = (item) => {
    if (item.startTime) {
      return new Date(item.startTime);
    } else if (item.workout && item.workout.startTime) {
      return new Date(item.workout.startTime);
    }
    return new Date(0); // fallback
  };

  const sortedWorkouts = allWorkouts.sort(
    (a, b) => getStartTime(a) - getStartTime(b)
  );

  // Write as JSON array - pretty format for development, minified for production
  log.info('Writing workout data to file');
  try {
    await fs.writeFile(summaryTarget, sortedWorkouts);
    log.info('Successfully wrote workout data to file');
  } catch (err) {
    log.error(['Error writing workout data to file', err]);
  }
};

module.exports = {
  appendWorkOutToFile,
};
