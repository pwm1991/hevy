const { parseWorkouts } = require('./index');
const { parseSets } = require('../parseSets');

jest.mock('../parseSets');

describe('parseWorkouts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns empty array when no workouts provided', () => {
    expect(parseWorkouts()).toEqual([]);
    expect(parseWorkouts(null)).toEqual([]);
    expect(parseWorkouts([])).toEqual([]);
  });

  test('parses workout with exercises correctly', () => {
    // Setup mock data
    const mockWorkout = {
      workout: {
        id: '123',
        title: 'Test Workout',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        exercises: [
          {
            title: 'Bench Press',
            notes: 'Heavy day',
            superset_id: null,
            sets: [{ weight_kg: 80, reps: 5 }],
          },
          {
            title: 'Squat',
            notes: '',
            superset_id: 'abc123',
            sets: [{ weight_kg: 100, reps: 3 }],
          },
        ],
      },
    };

    // Mock parseSets function
    parseSets.mockImplementation((sets) => ({
      sets: sets.map((set) => ({
        ...set,
        totalWeight: set.weight_kg * set.reps,
      })),
      setsTotalWeight: sets.reduce(
        (acc, set) => acc + set.weight_kg * set.reps,
        0
      ),
    }));

    // Execute
    const result = parseWorkouts([mockWorkout]);

    // Verify
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: '123',
      title: 'Test Workout',
      date: '2023-01-01',
      durationInMin: 60,
    });
    expect(result[0].workouts).toHaveLength(2);
    expect(result[0].workouts[0].title).toBe('Bench Press');
    expect(result[0].workouts[1].title).toBe('Squat');
    expect(parseSets).toHaveBeenCalledTimes(2);
  });

  test('handles workout with no exercises', () => {
    const mockWorkout = {
      workout: {
        id: '123',
        title: 'Empty Workout',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
        exercises: [],
      },
    };

    const result = parseWorkouts([mockWorkout]);
    expect(result).toEqual([]);
  });

  test('calculates duration correctly', () => {
    const mockWorkout = {
      workout: {
        id: '123',
        title: 'Test Workout',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:45:00Z',
        exercises: [
          {
            title: 'Test Exercise',
            sets: [{ weight_kg: 10, reps: 10 }],
          },
        ],
      },
    };

    parseSets.mockReturnValue({
      sets: [],
      setsTotalWeight: 100,
    });

    const result = parseWorkouts([mockWorkout]);
    expect(result[0].durationInMin).toBe(45);
  });

  test('accumulates total weight correctly', () => {
    const mockWorkout = {
      workout: {
        id: '123',
        title: 'Test Workout',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        exercises: [
          { title: 'Exercise 1', sets: [] },
          { title: 'Exercise 2', sets: [] },
        ],
      },
    };

    parseSets
      .mockReturnValueOnce({
        sets: [],
        setsTotalWeight: 100,
      })
      .mockReturnValueOnce({
        sets: [],
        setsTotalWeight: 150,
      });

    const result = parseWorkouts([mockWorkout]);
    expect(result[0].totalWeightInKg).toBe(250);
  });
});
