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

  test('parses workout with exs correctly', () => {
    // Setup mock data
    const mockWorkout = {
      workout: {
        id: '123',
        title: 'Test Workout',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        exs: [
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
      })),
    }));

    // Execute
    const result = parseWorkouts([mockWorkout]);

    // Verify
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: '123',
      title: 'Test Workout',
      date: '2023-01-01',
      duration: 60,
    });
    expect(result[0].workouts).toHaveLength(2);
    expect(result[0].workouts[0].title).toBe('Bench Press');
    expect(result[0].workouts[1].title).toBe('Squat');
    expect(parseSets).toHaveBeenCalledTimes(2);
  });

  test('handles workout with no exs', () => {
    const mockWorkout = {
      workout: {
        id: '123',
        title: 'Empty Workout',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T10:30:00Z',
        exs: [],
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
        exs: [
          {
            title: 'Test ex',
            sets: [{ weight_kg: 10, reps: 10 }],
          },
        ],
      },
    };

    parseSets.mockReturnValue({
      sets: [],
    });

    const result = parseWorkouts([mockWorkout]);
    expect(result[0].duration).toBe(45);
  });

  test('accumulates total weight correctly', () => {
    const mockWorkout = {
      workout: {
        id: '123',
        title: 'Test Workout',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        exs: [
          { title: 'ex 1', sets: [] },
          { title: 'ex 2', sets: [] },
        ],
      },
    };

    parseSets
      .mockReturnValueOnce({
        sets: [],
      })
      .mockReturnValueOnce({
        sets: [],
      });

    const result = parseWorkouts([mockWorkout]);
    expect(result[0].totalKg).toBe(250);
  });
});
