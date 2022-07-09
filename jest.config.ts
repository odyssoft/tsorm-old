import { Config } from '@jest/types'

const jestConfig: Config.InitialOptions = {
  clearMocks: true,
  moduleDirectories: ['./src', 'node_modules'],
  preset: 'ts-jest',
  rootDir: './src/',
  projects: [
    {
      rootDir: './src/',
      displayName: 'unit',
      testEnvironment: 'node',
      testRegex: './tests/unit/.*(spec|test)\\.ts?$',
      // testRegex: 'tests/unit/*.*(spec|test)\\.ts?$',
      transform: {
        '^.+\\.(t|j)s?$': 'ts-jest',
      },
      moduleDirectories: ['./src', 'node_modules'],
    },
    {
      rootDir: './src/',
      displayName: 'integration',
      testEnvironment: 'node',
      testRegex: './tests/integration/.*(spec|test)\\.ts?$',
      // globalSetup: './tests/setup.ts',
      transform: {
        '^.+\\.(t|j)s?$': 'ts-jest',
      },
      moduleDirectories: ['./src', 'node_modules'],
    },
  ],
  // testSequencer: './tests/sequencer.js',
  testPathIgnorePatterns: ['/node_modules/'],
}

export default jestConfig
