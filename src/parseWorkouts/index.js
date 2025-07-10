const log = require('../logger');

const { parseSets } = require('../parseSets');

const parseDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = (end - start) / 60000;
  return Math.round(duration);
};

const accTotalWeight = (arr) => {
  if (!arr || arr.length === 0) {
    log.error('Array is empty or undefined', { arr });
    return 0;
  }

  let total = arr.reduce((acc, set) => {
    // Get the weight value with fallbacks
    const weight = set.setsTotalWeight || 0;
    return acc + weight;
  }, 0);

  if (typeof total !== 'number' || isNaN(total)) {
    log.error('Total weight is not a number', { total });
    return 0;
  }
  return total;
};

const parseWorkouts = (workouts) => {
  if (!workouts) {
    return [];
  }
  const parsedWorkouts = workouts
    .map((event) => {
      const { id, title, startTime, endTime, exercises } = event.workout;
      if (exercises.length === 0) {
        return null;
      }
      let workouts = exercises.map((exercise) => {
        // Always call parseSets, even with empty sets, to respect test mocks
        let parsedSets = parseSets(exercise.sets || []);
        let data = {
          title: exercise.title,
          notes: exercise.notes || '',
          supersetId: exercise.superset_id,
          ...parsedSets,
        };
        return data;
      });
      let workoutParsed = {
        id,
        title,
        startTime: startTime,
        endTime: endTime,
        totalWeightInKg: accTotalWeight(workouts),
        durationInMin: parseDuration(startTime, endTime),
        workouts,
      };
      workoutParsed.claude = {
        id: workoutParsed.id.substring(6),
        startTime: new Date(startTime),
        durationInMin: workoutParsed.durationInMin,
        totalWeightInKg: workoutParsed.totalWeightInKg,
        title: workoutParsed.title,
      };
      return workoutParsed;
    })
    .filter((workout) => workout !== null);

  return parsedWorkouts;
};

module.exports = {
  parseWorkouts,
};
