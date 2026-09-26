/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: false,
    }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.dto.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  transformIgnorePatterns: [
    '/node_modules/(?!(@nestjs|typeorm|class-validator|class-transformer|@angular)/)',
  ],
  moduleNameMapper: {
    '^@nestjs/jwt$': '<rootDir>/__mocks__/@nestjs/jwt.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
