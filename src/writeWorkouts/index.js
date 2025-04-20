const log = require("../logger");
const fs = require("fs");

const createFileIfNotExists = async (fileTarget) => {
  const fileExists = fs.existsSync(fileTarget);
  if (fileExists) {
    log.info(`File ${fileTarget} exists`);
    return true;
  } else {
    log.info(`File ${fileTarget} does not exist`);
    fs.writeFileSync(fileTarget, "");
  }
  return fileExists;
};

const appendWorkOutToFile = async (processedWorkouts) => {
  // Store processed summaries
  const summaryTarget = process.env.HEVY_STORE;
  log.info(`Appending workout summaries to file, ${summaryTarget}`);
  await createFileIfNotExists(summaryTarget);

  let summaryContent = "";
  if (Array.isArray(processedWorkouts)) {
    processedWorkouts.forEach((workoutItem) => {
      const workoutString = JSON.stringify(workoutItem) + "\n";
      summaryContent += workoutString;
    });
  }

  log.info("Appending summaries to file");
  fs.appendFile(summaryTarget, summaryContent, (err) => {
    if (err) log.error(["Error writing summaries to file", err]);
    log.info("Appended summaries to file");
  });
};

module.exports = {
  appendWorkOutToFile,
};
