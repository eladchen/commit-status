// https://jestjs.io/docs/en/configuration
module.exports = {
  rootDir: "./",

  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*test.ts?(x)"],
  moduleFileExtensions: ["ts", "js", "json", "node"],

  collectCoverage: process.env.CI !== undefined,
  coverageDirectory: "build/coverage/unit",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  collectCoverageFrom: ["src/**", "!src/__tests__/**"],

  setupFilesAfterEnv: ["jest-expect-message"],
};
