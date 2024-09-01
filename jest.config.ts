import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
    roots: ['<rootDir>/tests', '<rootDir>/src'],
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/**/index.ts',
      '!<rootDir>/src/infra/**/*-helper.ts',
      '!<rootDir>/src/main/**'
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    coverageThreshold: {
      global: {
        statements: 100,
        branches: 100,
        lines: 100,
        functions: 100
      }
    },
    transform: {
      '.+\\.ts$': '@swc/jest'
    },
    reporters: [
      'default',
      ['jest-slow-test-reporter', { 'numTests': 5, 'warnOnSlowerThan': 500, 'color': true }]
    ],
    moduleNameMapper: {
      '@/tests/(.*)': '<rootDir>/tests/$1',
      '@/(.*)': '<rootDir>/src/$1'
    }
  };
};