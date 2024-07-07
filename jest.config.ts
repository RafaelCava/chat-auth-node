import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
    roots: ['<rootDir>/tests', '<rootDir>/src'],
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/**/index.ts',
      '!<rootDir>/src/main/**'
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    testEnvironment: 'node',
    transform: {
      '.+\\.ts$': '@swc/jest'
    },
    reporters: [
      ['jest-slow-test-reporter', { 'numTests': 5, 'warnOnSlowerThan': 300, 'color': true }]
    ],
    // preset: '@shelf/jest-mongodb',
    moduleNameMapper: {
      '@/tests/(.*)': '<rootDir>/tests/$1',
      '@/(.*)': '<rootDir>/src/$1'
    }
  };
};