const log = require('../logger');
const { parseSets, POUNDS_TO_KG } = require('./index');

const exampleSetInKg = [
    {
        index: 0,
        type: 'normal',
        weight_kg: 15,
        reps: 15,
        distance_meters: null,
        duration_seconds: null,
        rpe: null,
    },
    {
        index: 0,
        type: 'normal',
        weight_kg: 60,
        reps: 8,
        distance_meters: null,
        duration_seconds: null,
        rpe: null,
    },
];

const exampleSetInLbs = [
    {
        index: 0,
        type: 'normal',
        weight_lb: 15,
        reps: 15,
        distance_meters: null,
        duration_seconds: null,
        rpe: null,
    },
];

describe('parseSets', () => {
    describe('when sets are in kg', () => {
        test('should return a parsed set object', () => {
            const expectedOutcome = [
                { reps: 15, weight: 15, totalWeight: 225 },
                { reps: 8, weight: 60, totalWeight: 480 },
            ];
            const result = parseSets(exampleSetInKg).sets;
            expect(result).toEqual(expectedOutcome);
        });
        test('should sum the totalWeight in KG correctly', () => {
            const result = parseSets(exampleSetInKg);
            expect(result.setsTotalWeight).toBe(705);
        });
    });
    describe('when sets are in lbs', () => {
        test('should sum the totalWeight in LBs correctly', () => {
            const result = parseSets(exampleSetInLbs);
            expect(result.setsTotalWeight).toBe(225 * POUNDS_TO_KG);
        });
    });
});
