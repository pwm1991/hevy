require('dotenv').config();
const pino = require('pino');
const pretty = require('pino-pretty');
const logLevel = process.env.PINO_LOG_LEVEL || 'prod';
const options = pretty({
  colorize: true,
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['email', 'HEVY_KEY'],
  },
});
const log = pino(options);
log.info(`Logger initialized, level: ${logLevel}`);
log.info(
  {
    NODE_ENV: process.env.NODE_ENV,
    HEVY_KEY: process.env.HEVY_KEY !== undefined,
    START_DATE: process.env.START_DATE,
    HEVY_STORE: process.env.HEVY_STORE,
    MY_WEIGHT_IN_KG: process.env.MY_WEIGHT_IN_KG,
  },
  'Environment variables'
);
module.exports = log;
