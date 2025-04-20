const log = require('../logger');
const fs = require('fs');
const createHugoPost = require('./hugo');

const createFileIfNotExists = async (fileTarget) => {
    const fileExists = fs.existsSync(fileTarget);
    if (fileExists) {
        log.info(`File ${fileTarget} exists`);
        return true;
    } else {
        log.info(`File ${fileTarget} does not exist`);
        fs.writeFileSync(fileTarget, '');
    }
    return fileExists;
};

const appendWorkOutToFile = async (workout) => {
    const fileTarget = process.env.HEVY_STORE;
    log.info(`Appending workout to file, ${fileTarget}`);
    await createFileIfNotExists(fileTarget);
    let content = '';
    if (Array.isArray(workout)) {
        workout.forEach((workoutItem) => {
            const workoutString = JSON.stringify(workoutItem) + '\n';
            content += workoutString;
            if (process.env.HUGO_WRITE) createHugoPost(workoutItem);
        });
    }
    log.info('Appending to file');
    fs.appendFile(fileTarget, content, (err) => {
        if (err) log.error(['Error writing to file', err]);
        log.info('Appended to file');
    });
};

module.exports = {
    appendWorkOutToFile,
};
