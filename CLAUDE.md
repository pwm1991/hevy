# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Run a single test: `npx jest path/to/test.test.js`
- Run the application: `npm start`
- Clean temporary files: `npm run clean`

## Code Style Guidelines
- Use CommonJS module system (require/module.exports)
- Follow JavaScript conventions for variable naming (camelCase)
- Error handling: Use try/catch blocks with appropriate logging
- Prefer async/await for asynchronous operations
- Use const for variables that don't change, let otherwise
- Code files should export functionality via module.exports
- Logging: Use the pino logger from src/logger with appropriate log levels
- Tests: Write Jest tests for new functionality
- Keep code modular with single-purpose functions
- Include JSDoc-style comments for complex functions