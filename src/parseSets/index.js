const POUNDS_TO_KG = 0.45359237;

const parseSets = (sets) => {
    if (!sets) {
        throw new Error('No sets found');
    }
    const reducedSetInformation = sets.map((set) => {
        const { reps, weight_kg, weight_lb } = set;
        let weight = weight_kg ? weight_kg : weight_lb * POUNDS_TO_KG;
        return {
            reps,
            totalWeight: reps * Math.round(weight) || 0,
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
