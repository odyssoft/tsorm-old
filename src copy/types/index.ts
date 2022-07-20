export * from './model'
export * from './operator'
export * from './schema'
export * from './where'

export type KeyOf<T extends any> = Extract<keyof T, string>
