'use strict';

module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.js?(x)',
    '<rootDir>/**/*.(spec|test).js?(x)',
    '<rootDir>/**/*-(spec|test).js?(x)',
  ],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
};
