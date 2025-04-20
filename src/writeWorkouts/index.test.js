const fs = require("fs");
const { appendWorkOutToFile } = require("./index");
const { getFileStorePath } = require("../files");
const log = require("../logger");

// Mock dependencies
jest.mock("fs", () => {
  const originalModule = jest.requireActual("fs");
  return {
    ...originalModule,
    promises: {
      access: jest.fn(),
      readFile: jest.fn(),
      writeFile: jest.fn(),
    },
  };
});
jest.mock("../logger");
jest.mock("../files", () => ({
  getFileStorePath: jest.fn().mockReturnValue("/mock/path/workouts.json"),
}));

describe("writeWorkouts", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Set up environment variable
    process.env.HEVY_STORE = "workouts.json";
  });

  afterEach(() => {
    // Clean up environment variable
    delete process.env.HEVY_STORE;
  });

  describe("appendWorkOutToFile", () => {
    test("should handle file that doesn't exist", async () => {
      // Setup
      fs.promises.access.mockRejectedValue(new Error("File not found"));

      const mockWorkouts = [
        { id: "1", exercise: "Squat", date: "2023-01-01" },
        { id: "2", exercise: "Bench Press", date: "2023-01-01" },
      ];

      // Execute
      await appendWorkOutToFile(mockWorkouts);

      // Verify
      expect(log.info).toHaveBeenCalledWith(
        "File /mock/path/workouts.json does not exist, will create it",
      );
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        "/mock/path/workouts.json",
        JSON.stringify(mockWorkouts, null, 2),
        "utf8",
      );
    });

    test("should write workout data to empty file", async () => {
      // Setup
      fs.promises.access.mockResolvedValue(undefined);
      fs.promises.readFile.mockResolvedValue("");

      const mockWorkouts = [
        { id: "1", exercise: "Squat", date: "2023-01-01" },
        { id: "2", exercise: "Bench Press", date: "2023-01-01" },
      ];

      // Execute
      await appendWorkOutToFile(mockWorkouts);

      // Verify
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        "/mock/path/workouts.json",
        JSON.stringify(mockWorkouts, null, 2),
        "utf8",
      );
      expect(log.info).toHaveBeenCalledWith(
        "Successfully wrote workout data to file",
      );
    });

    test("should merge with existing workouts and write as JSON array", async () => {
      // Setup
      fs.promises.access.mockResolvedValue(undefined);

      // Mock existing workouts in file
      const existingWorkouts = [
        {
          id: "existing1",
          exercise: "Deadlift",
          date: "2023-01-01",
          start_time: "2023-01-01T10:00:00Z",
        },
      ];
      fs.promises.readFile.mockResolvedValue(JSON.stringify(existingWorkouts));

      const newWorkouts = [
        {
          id: "new1",
          exercise: "Squat",
          date: "2023-01-02",
          start_time: "2023-01-02T10:00:00Z",
        },
      ];

      // Execute
      await appendWorkOutToFile(newWorkouts);

      // Verify that the read function was called
      expect(fs.promises.readFile).toHaveBeenCalledWith(
        "/mock/path/workouts.json",
        "utf8",
      );

      // Verify the combined and sorted array was written
      const expectedCombined = [...existingWorkouts, ...newWorkouts];
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        "/mock/path/workouts.json",
        JSON.stringify(expectedCombined, null, 2),
        "utf8",
      );
      expect(log.info).toHaveBeenCalledWith(
        "Successfully wrote workout data to file",
      );
    });

    test("should handle empty workout arrays", async () => {
      // Execute
      await appendWorkOutToFile([]);

      // Verify
      expect(log.info).toHaveBeenCalledWith(
        "No new workouts to add, skipping file update",
      );
      expect(fs.promises.writeFile).not.toHaveBeenCalled();
    });

    test("should log error if write fails", async () => {
      // Setup
      fs.promises.access.mockResolvedValue(undefined);
      const mockError = new Error("Write failed");

      fs.promises.readFile.mockResolvedValue("[]");
      fs.promises.writeFile.mockRejectedValue(mockError);

      // Execute
      await appendWorkOutToFile([{ id: "1" }]);

      // Verify
      expect(log.error).toHaveBeenCalledWith([
        "Error writing workout data to file",
        mockError,
      ]);
    });

    test("should handle non-array input gracefully", async () => {
      // Execute
      await appendWorkOutToFile("not an array");

      // Verify
      expect(log.error).toHaveBeenCalledWith(
        "processedWorkouts is not an array",
      );
      expect(fs.promises.writeFile).not.toHaveBeenCalled();
    });

    test("should handle invalid JSON", async () => {
      // Setup
      fs.promises.access.mockResolvedValue(undefined);

      // Mock invalid JSON content in the file
      const invalidJson = "{ this is not valid JSON }";
      fs.promises.readFile.mockResolvedValue(invalidJson);

      const newWorkout = {
        id: "3",
        exercise: "Deadlift",
        start_time: "2023-01-03T10:00:00Z",
      };

      // Execute
      await appendWorkOutToFile([newWorkout]);

      // Verify
      expect(log.error).toHaveBeenCalledWith(
        expect.stringContaining("Error parsing JSON"),
      );

      // Should write only the new workout as the existing data couldn't be parsed
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        "/mock/path/workouts.json",
        JSON.stringify([newWorkout], null, 2),
        "utf8",
      );
    });
  });
});