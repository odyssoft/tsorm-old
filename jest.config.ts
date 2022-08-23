import { Config } from '@jest/types'

const jestConfig: Config.InitialOptions = {
  rootDir: './src/',
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  verbose: true,
  moduleDirectories: ['./src', 'node_modules'],
  transform: {
    '^.+\\.(t|j)s?$': 'ts-jest',
  },
  testRegex: '/tests/.*test\\.ts?$',
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: ['/node_modules/', '/src/mocks'],
}

export default jestConfig
