const fs = require("fs");
const path = require("path");
const { appendWorkOutToFile } = require("./index");
const log = require("../logger");

// Mock dependencies
jest.mock("fs");
jest.mock("../logger");

describe("writeWorkouts", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up environment variable
    process.env.HEVY_STORE = "/mock/path/workouts.json";
  });

  afterEach(() => {
    // Clean up environment variable
    delete process.env.HEVY_STORE;
  });

  describe("appendWorkOutToFile", () => {
    test("should create file if it doesn't exist", async () => {
      // Setup
      fs.existsSync.mockReturnValue(false);
      
      // Execute
      await appendWorkOutToFile([], []);
      
      // Verify
      expect(fs.existsSync).toHaveBeenCalledWith("/mock/path/workouts.json");
      expect(fs.writeFileSync).toHaveBeenCalledWith("/mock/path/workouts.json", "");
      expect(log.info).toHaveBeenCalledWith("File /mock/path/workouts.json does not exist");
    });

    test("should not create file if it already exists", async () => {
      // Setup
      fs.existsSync.mockReturnValue(true);
      
      // Execute
      await appendWorkOutToFile([], []);
      
      // Verify
      expect(fs.existsSync).toHaveBeenCalledWith("/mock/path/workouts.json");
      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(log.info).toHaveBeenCalledWith("File /mock/path/workouts.json exists");
    });

    test("should append workout data to file", async () => {
      // Setup
      fs.existsSync.mockReturnValue(true);
      const mockWorkouts = [
        { id: "1", exercise: "Squat", date: "2023-01-01" },
        { id: "2", exercise: "Bench Press", date: "2023-01-01" }
      ];
      
      // Mock fs.appendFile implementation
      fs.appendFile.mockImplementation((path, content, callback) => {
        callback(null);
      });
      
      // Execute
      await appendWorkOutToFile(mockWorkouts, []);
      
      // Verify
      expect(fs.appendFile).toHaveBeenCalledWith(
        "/mock/path/workouts.json",
        JSON.stringify(mockWorkouts[0]) + "\n" + JSON.stringify(mockWorkouts[1]) + "\n",
        expect.any(Function)
      );
      expect(log.info).toHaveBeenCalledWith("Appended summaries to file");
    });

    test("should handle empty workout arrays", async () => {
      // Setup
      fs.existsSync.mockReturnValue(true);
      
      // Mock fs.appendFile implementation
      fs.appendFile.mockImplementation((path, content, callback) => {
        callback(null);
      });
      
      // Execute
      await appendWorkOutToFile([], []);
      
      // Verify
      expect(fs.appendFile).toHaveBeenCalledWith(
        "/mock/path/workouts.json",
        "",
        expect.any(Function)
      );
    });

    test("should log error if append fails", async () => {
      // Setup
      fs.existsSync.mockReturnValue(true);
      const mockError = new Error("Append failed");
      
      // Mock fs.appendFile implementation with error
      fs.appendFile.mockImplementation((path, content, callback) => {
        callback(mockError);
      });
      
      // Execute
      await appendWorkOutToFile([{ id: "1" }], []);
      
      // Verify
      expect(log.error).toHaveBeenCalledWith(["Error writing summaries to file", mockError]);
    });

    test("should handle non-array input gracefully", async () => {
      // Setup
      fs.existsSync.mockReturnValue(true);
      
      // Mock fs.appendFile implementation
      fs.appendFile.mockImplementation((path, content, callback) => {
        callback(null);
      });
      
      // Execute
      await appendWorkOutToFile("not an array", []);
      
      // Verify
      expect(fs.appendFile).toHaveBeenCalledWith(
        "/mock/path/workouts.json",
        "",
        expect.any(Function)
      );
    });
  });
});