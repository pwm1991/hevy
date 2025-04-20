require('dotenv').config();
const log = require('../logger');
const BASE_URL = 'https://api.hevyapp.com/v1';
const ENDPOINT = '/workouts/events';

const { checkFileStore } = require('../files');

const callHevy = async (urlProperties) => {
    const headers = {
        accept: 'application/json',
        'api-key': process.env.HEVY_KEY,
    };
    const fullUrl = `${BASE_URL}${ENDPOINT}?${urlProperties}`;
    log.info(`Fetching from Hevy API: ${fullUrl}`);
    const response = await fetch(fullUrl, {
        headers,
    });
    let data = await response.json();
    return data;
};

const getWorkouts = async () => {
    log.info('Fetching workouts from Hevy API');
    const { lastWorkout } = await checkFileStore();

    try {
        let pageNumber = 1;
        const hevyPageLimit = process.env.HEVY_PAGE_LIMIT || 10;
        let urlProperties = `page=${pageNumber}&pageSize=${hevyPageLimit}&since=${lastWorkout}`;
        let hevyResponse = await callHevy(urlProperties);
        const workouts = [];
        workouts.push(...hevyResponse.events);

        const firstResponseTotalPages = hevyResponse.page_count;
        if (firstResponseTotalPages > 1) {
            for (let i = 2; i <= firstResponseTotalPages; i++) {
                log.info(`Fetching page ${i} of ${firstResponseTotalPages}`);
                urlProperties = `page=${i}&pageSize=${hevyPageLimit}&since=${lastWorkout}`;
                hevyResponse = await callHevy(urlProperties);
                workouts.push(...hevyResponse.events);
                log.info(`Total workouts ${workouts.length}`);
            }
        }

        log.info(`Total workouts parsed: ${workouts.length}`);
        return workouts;
    } catch (e) {
        error(e);
        process.exit(1);
    }
};
module.exports = { getWorkouts };
