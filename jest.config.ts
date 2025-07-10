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
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  modulePathIgnorePatterns: ["<rootDir>/doc/", "<rootDir>/dist/"],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
};
