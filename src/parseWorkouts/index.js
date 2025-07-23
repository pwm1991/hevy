const log = require('../logger');

const { parseSets } = require('../parseSets');

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
  const parsedWorkouts = workouts
    .map((event) => {
      const { id, title, start_time, end_time, exercises } = event.workout;
      if (exercises.length === 0) {
        return null;
      }
      let workouts = exercises.map((ex) => {
        // Always call parseSets, even with empty sets, to respect test mocks
        let parsedSets = parseSets(ex.sets || []);
        let data = {
          ex: ex.title,
          notes: ex.notes || undefined,
          superset: ex.superset_id || undefined,
          ...parsedSets,
        };
        Object.keys(data).forEach((key) => {
          if (data[key] === undefined) {
            delete data[key];
          }
        });
        return data;
      });
      return {
        id,
        title,
        date: start_time.slice(0, 10),
        duration: parseDuration(start_time, end_time),
        workouts,
      };
    })
    .filter((workout) => workout !== null);

  return parsedWorkouts;
};

module.exports = {
  parseWorkouts,
};
