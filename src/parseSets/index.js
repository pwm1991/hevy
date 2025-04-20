const POUNDS_TO_KG = 0.45359237;

const parseSets = (sets) => {
  if (!sets) {
    throw new Error("No sets found");
  }
  const reducedSetInformation = sets.map((set) => {
    const { index, type, reps, weight_kg, weight_lb, rpe } = set;
    const workoutMeasurementInKg = () => {
      if (weight_kg > 0) return weight_kg;
      if (weight_lb && weight_lb > 0) return weight_lb * POUNDS_TO_KG;
      return process.env.MY_WEIGHT_IN_KG;
    };
    const workoutMeasurement = workoutMeasurementInKg();
    return {
      reps,
      rpe,
      index,
      type,
      weight: workoutMeasurement,
      totalWeight: reps * workoutMeasurement || 0,
    };
  });

  const setsTotalWeight = reducedSetInformation.reduce((acc, set) => {
    return acc + set.totalWeight;
  }, 0);

  return {
    sets: reducedSetInformation,
    setsTotalWeight,
  };
};

module.exports = {
  parseSets,
  POUNDS_TO_KG,
};
