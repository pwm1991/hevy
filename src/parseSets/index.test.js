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
  },
  {
    index: 0,
    type: 'normal',
    weight_kg: 60,
    reps: 8,
    distance_meters: null,
    duration_seconds: null,
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
  },
];

describe('parseSets', () => {
  describe('when sets are in kg', () => {
    test('should return a parsed set object', () => {
      const expectedOutcome = [
        {
          reps: 15,
          weight: 15,
          index: 0,
          type: 'normal',
        },
        {
          reps: 8,
          weight: 60,
          index: 0,
          type: 'normal',
        },
      ];
      const result = parseSets(exampleSetInKg).sets;
      expect(result).toEqual(expectedOutcome);
    });
  });
});
