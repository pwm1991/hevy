const POUNDS_TO_KG = 0.45359237;

const getSetWeight = (set) => {
  if (set.weight_kg > 0) return set.weight_kg;
  if (set.weight_lb && set.weight_lb > 0) return set.weight_lb * POUNDS_TO_KG;
  return process.env.MY_WEIGHT_IN_KG;
};

const parseSets = (sets) => {
  const reducedSetInformation = sets.map((set) => {
    const { index, type, reps, rpe } = set;
    let data = {
      index,
      type,
      reps,
      rpe: rpe || undefined,
      weight: getSetWeight(set),
    };
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });
    return data;
  });

  return {
    sets: reducedSetInformation,
  };
};

module.exports = {
  parseSets,
  POUNDS_TO_KG,
};
