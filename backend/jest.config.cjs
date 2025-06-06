module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html", "lcov"],
  collectCoverageFrom: [
    "services/**/*.js",
    "!services/**/*.test.js"
  ],
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],
  setupFilesAfterEnv: ["<rootDir>/test-setup.js"]
};
