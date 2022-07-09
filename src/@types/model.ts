export interface AliasModelType<T> {
  [key: string]: any
}

export interface ModelType<T> extends AliasModelType<T> {
  as: (alias: string) => AliasModelType<T>
}
