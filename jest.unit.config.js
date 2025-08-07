/** @type {import('jest').Config} */
module.exports = {
    ...require('./jest.config.js'),
    testMatch: ['**/services/__tests__/**/*.test.ts'],
    testTimeout: 10000, 
    // Unit tests don't need database setup
    testEnvironment: 'node',
}; 