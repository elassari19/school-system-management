/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  // clearMocks: true,
  // preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  // setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
};
