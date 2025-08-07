/** @type {import('jest').Config} */
module.exports = {
    ...require('./jest.config.js'),
    testMatch: ['**/__tests__/e2e/**/*.test.ts'],
    testTimeout: 30000,
    setupFilesAfterEnv: ['<rootDir>/__tests__/utils/db.ts'],
    // E2E tests might need different environment setup
    testEnvironment: 'node',
}; 