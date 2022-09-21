import { defaults as tsjPreset } from 'ts-jest/presets';

export default {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'node_modules/',
    'dist/',
    'test/',
    'src/main.ts',
    '.module.ts',
    '.test.ts',
  ],
  detectOpenHandles: true,
  forceExit: true,
  rootDir: './',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: tsjPreset.transform,
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
    '^test/(.*)': '<rootDir>/test/$1',
  },
};
