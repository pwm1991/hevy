const log = require('../logger');

const { parseSets } = require('../parseSets');

const formatWeightToString = (weight) => {
    return weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'kg';
};
const formatDurationToString = (duration) => {
    return duration.toString() + ' min';
};

const parseDuration = (start_time, end_time) => {
    const start = new Date(start_time);
    const end = new Date(end_time);
    const duration = (end - start) / 60000;
    return Math.round(duration);
};

const parseWorkouts = (workouts) => {
    if (!workouts) {
        return [];
    }
    const parsedWorkouts = workouts.map((event) => {
        const { id, title, start_time, end_time, exercises } = event.workout;
        if (exercises.length === 0) {
            return null;
        }
        // Remove numbers from the title, e.g. "1. Bench Press" and then title case
        let totalWeightInKg = 0;
        // Parse the exercises
        const sets = exercises.map((exercise) => {
            log.debug(exercise.sets);
            return parseSets(exercise.sets);
        });
        // Get the total weight of all the exercises
        totalWeightInKg = sets.reduce((acc, set) => {
            return acc + set.setsTotalWeight;
        }, 0);
        const duration = parseDuration(start_time, end_time);
        return {
            id,
            title,
            start_time,
            end_time,
            totalWeightInKg: formatWeightToString(totalWeightInKg) || '? kg',
            duration: formatDurationToString(duration) || '? min',
        };
    });
    return parsedWorkouts;
};

module.exports = {
    parseWorkouts,
};
