module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
    },
};