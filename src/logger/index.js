require("dotenv").config();
const pino = require("pino");
const pretty = require("pino-pretty");
const logLevel = process.env.PINO_LOG_LEVEL || "prod";
const options = pretty({
  colorize: true,
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ["email", "HEVY_KEY", "ANTHROPIC_KEY", "GYM_BRO_PROJECT"],
  },
});
const log = pino(options);
log.info(`Logger initialized, level: ${logLevel}`);
module.exports = log;
