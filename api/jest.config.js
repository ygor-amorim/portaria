module.exports = {
    testEnvironment: 'node',
    globalSetup: './src/tests/setup.js',
    testTimeout: 30000,
    testMatch: ['**/tests/**/*.test.js'],
};
