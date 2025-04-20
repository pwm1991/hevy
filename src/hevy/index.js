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
  log.debug(fullUrl);
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

    const totalPages = hevyResponse.page_count;
    if (totalPages > 1) {
      log.info(`Total pages: ${totalPages}`);
      const fetchPromises = [];
      for (let i = 2; i <= totalPages; i++) {
        const pageProps = `page=${i}&pageSize=${hevyPageLimit}&since=${lastWorkout}`;
        fetchPromises.push(callHevy(pageProps));
      }
      const results = await Promise.all(fetchPromises);
      results.forEach((res) => {
        if (res && Array.isArray(res.events)) {
          workouts.push(...res.events);
        }
      });
    }

    log.info(`Total workouts: ${workouts.length}`);
    return workouts;
  } catch (e) {
    log.error(e);
    process.exit(1);
  }
};
module.exports = { getWorkouts };
