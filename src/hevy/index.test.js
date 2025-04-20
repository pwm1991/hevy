const { getWorkouts } = require("./index");
const { checkFileStore } = require("../files");

jest.mock("../files");
// Global fetch is native in Node.js environments now

describe("getWorkouts", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.HEVY_KEY = "test-key";
    process.env.HEVY_PAGE_LIMIT = "10";
  });

  test("fetches workouts from API with correct URL params", async () => {
    // Setup
    const mockLastDate = "2023-01-01T00:00:00.000Z";
    checkFileStore.mockResolvedValue({ lastWorkout: mockLastDate });

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        events: [{ id: "1" }, { id: "2" }],
        page_count: 1,
      }),
    });

    // Execute
    const result = await getWorkouts();

    // Verify
    expect(checkFileStore).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.hevyapp.com/v1/workouts/events?page=1&pageSize=10&since=${mockLastDate}`,
      { headers: { accept: "application/json", "api-key": "test-key" } },
    );
    expect(result).toEqual([{ id: "1" }, { id: "2" }]);
  });

  test("handles multiple pages of results", async () => {
    // Setup
    const mockLastDate = "2023-01-01T00:00:00.000Z";
    checkFileStore.mockResolvedValue({ lastWorkout: mockLastDate });

    const mockFirstResponse = {
      events: [{ id: "1" }, { id: "2" }],
      page_count: 2,
    };

    const mockSecondResponse = {
      events: [{ id: "3" }, { id: "4" }],
      page_count: 2,
    };

    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockFirstResponse),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockSecondResponse),
        }),
      );

    // Execute
    const result = await getWorkouts();

    // Verify
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      { id: "1" },
      { id: "2" },
      { id: "3" },
      { id: "4" },
    ]);
  });
});
