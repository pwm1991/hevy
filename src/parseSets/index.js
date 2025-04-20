const POUNDS_TO_KG = 0.45359237;

const parseSets = (sets) => {
  if (!sets) {
    throw new Error("No sets found");
  }
  const reducedSetInformation = sets.map((set) => {
    const { index, type, reps, weight_kg, weight_lb, rpe } = set;
    let weight = weight_kg ? weight_kg : weight_lb * POUNDS_TO_KG;
    if (type === "Pull Up") {
      log.info(`Pull Up detected, using weight from environment variable`);
      log.info(set);
    }
    if (weight === 0) {
      log.info(`Weight not detected '${type}', defaulting to MY_WEIGHT_IN_KG`);
      weight = process.env.MY_WEIGHT_IN_KG;
    }
    return {
      reps,
      rpe,
      index,
      type,
      weight: weight_kg || weight_lb,
      totalWeight: reps * weight || 0,
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
