module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/index.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  modulePathIgnorePatterns: [
    "<rootDir>/src/infrastructure/config/aliases.ts",
    "<rootDir>/dist/",
  ],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
};
