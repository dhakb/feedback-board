/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    // Only run files that end with .test.ts
    testMatch: ['**/*.test.ts'],
    // Base configuration - will be extended by specific configs
};
