require('dotenv').config();
const log = require('../logger');

const fs = require('fs').promises;
const path = require('path');

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
    const fileContent = await fs.readFile(FILE_STORE, 'utf8');

    const lines = fileContent.trim().split('\n');
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
        const data = await fs
            .readFile(filePath, 'utf8')
            .then((data) => data.trim().split('\n').map(JSON.parse));
        const sortedData = data.sort((a, b) => {
            return new Date(a.start_time) - new Date(b.start_time);
        });
        const sortedJsonl = sortedData
            .map((item) => JSON.stringify(item))
            .join('\n');
        await fs.writeFile(filePath, sortedJsonl, 'utf8');
        log.info(`File store sorted by start_time`);
    } catch (err) {
        log.error(`Error sorting file store: ${err}`);
    }
};

module.exports = {
    checkFileStore,
};
