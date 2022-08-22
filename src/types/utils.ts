export type Indexable = {
  [key: string]: any
}

export type KeyOf<T extends any> = Extract<keyof T, string>
