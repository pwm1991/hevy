const log = require("../logger");

const { parseSets } = require("../parseSets");

const parseDuration = (start_time, end_time) => {
  const start = new Date(start_time);
  const end = new Date(end_time);
  const duration = (end - start) / 60000;
  return Math.round(duration);
};

const accTotalWeight = (arr) => {
  if (!arr || arr.length === 0) {
    log.error("Array is empty or undefined", { arr });
    return 0;
  }
  let total = arr.reduce((acc, set) => {
    return acc + (set.totalWeightInKg || set.setsTotalWeight || 0);
  }, 0);
  if (typeof total !== "number" || isNaN(total)) {
    log.error("Total weight is not a number", { total });
    return 0;
  }
  return total;
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
    let workouts = exercises.map((exercise) => {
      let parsedSets = parseSets(exercise.sets);
      let data = {
        title: exercise.title,
        notes: exercise.notes || "",
        supersetId: exercise.superset_id,
        ...parsedSets,
      };
      return data;
    });
    let workoutParsed = {
      id,
      title,
      start_time: start_time,
      end_time: end_time,
      totalWeightInKg: accTotalWeight(workouts),
      durationInMin: parseDuration(start_time, end_time),
      workouts,
    };
    return workoutParsed;
  });
  return parsedWorkouts;
};

module.exports = {
  parseWorkouts,
};
