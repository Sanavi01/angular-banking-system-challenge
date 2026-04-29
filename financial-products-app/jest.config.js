module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterFramework: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
    '!src/environments/**',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/test.ts',
  ],
};
