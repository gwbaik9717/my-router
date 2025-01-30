const path = require("path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: path.resolve(__dirname),
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
