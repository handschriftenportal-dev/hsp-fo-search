
module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**'
  ],
  coverageDirectory: './test-reports',
  coverageReporters: ['lcov'],
  moduleDirectories: [
    'node_modules',
    '<rootDir>'
  ],
  moduleNameMapper: {
    '@fontsource/*': '<rootDir>/test/testutils/fontMock.ts',
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-reports',
      suiteName: 'hsp-fo-search'
    }]
  ],
  testMatch: [
    '**/test/**/*.spec.ts',
    '**/test/**/*.spec.tsx'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest'
  },
}
