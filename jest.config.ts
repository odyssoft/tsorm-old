import { Config } from '@jest/types'

const jestConfig: Config.InitialOptions = {
  clearMocks: true,
  moduleDirectories: ['./src', 'node_modules'],
  preset: 'ts-jest',
  rootDir: './src/',
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'node',
      testRegex: '/tests/unit/.*(spec|test)\\.ts?$',
      transform: {
        '^.+\\.(t|j)s?$': 'ts-jest',
      },
    },
    {
      rootDir: './src',
      displayName: 'integration',
      testEnvironment: 'node',
      testRegex: '/integration/.*(spec|test)\\.ts?$',
      globalSetup: './tests/setup.ts',
      transform: {
        '^.+\\.(t|j)s?$': 'ts-jest',
      },
      moduleDirectories: ['./src', 'node_modules'],
    },
  ],
  testSequencer: './tests/sequencer.js',
  testPathIgnorePatterns: ['/node_modules/'],
}

export default jestConfig
