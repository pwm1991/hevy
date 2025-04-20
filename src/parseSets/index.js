const POUNDS_TO_KG = 0.45359237;

const getSetWeight = (set) => {
  if (set.weight_kg > 0) return set.weight_kg;
  if (set.weight_lb && set.weight_lb > 0) return set.weight_lb * POUNDS_TO_KG;
  return process.env.MY_WEIGHT_IN_KG;
};

const parseSets = (sets) => {
  const reducedSetInformation = sets.map((set) => {
    const { index, type, reps, rpe } = set;
    return {
      reps,
      rpe,
      index,
      type,
      weight: getSetWeight(set),
      totalWeight: reps * getSetWeight(set) || 0,
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
  POUNDS_TO_KG
};
