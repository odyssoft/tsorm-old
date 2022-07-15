import { AliasModelType, ModelKeys, ModelType } from './@types/model'

function createModel<T>(name: string, keys: ModelKeys<T>) {
  abstract class Model<S> implements AliasModelType<S> {
    properties: Partial<T>
    constructor(object: T) {
      this.properties = object
    }
    static as(alias: string): ModelType<T> {
      return Model<T>
    }
    static count(): Promise<number> {
      return Promise.resolve(0)
    }
    static create?: (() => Promise<any>) | undefined
    static deleteMany?: (() => Promise<any>) | undefined
    static deleteOne?: (() => Promise<any>) | undefined
    static distinct?: (() => Promise<T[]>) | undefined
    static exists?: (() => Promise<boolean>) | undefined
    static find?: (() => Promise<T[]>) | undefined
    static findById?: (() => Promise<T>) | undefined
    static findByIdAndDelete?: (() => Promise<any>) | undefined
    static findByIdAndRemove?: (() => Promise<any>) | undefined
    static findByIdAndUpdate?: (() => Promise<T>) | undefined
    static findOne?: (() => Promise<T>) | undefined
    static findOneAndDelete?: (() => Promise<any>) | undefined
    static findOneAndRemove?: (() => Promise<any>) | undefined
    static findOneAndReplace?: (() => Promise<T>) | undefined
    static findOneAndUpdate?: (() => Promise<T>) | undefined
    static insertMany?: (() => Promise<any>) | undefined
    static update?: (() => Promise<T>) | undefined
    static updateMany?: (() => Promise<T[]>) | undefined
    static updateOne?: (() => Promise<T>) | undefined
  }
  return Model<T>
}

interface IUser {
  name: string
  password: string
  age: number
}

const User = createModel<IUser>('user', {
  name: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  password: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  age: {
    type: 'INT',
    required: true,
  },
})

const user = (new User({ name: 'test', password: 'test', age: 1 }) =
  // user.

  //  Create model UserModel = createModel => Model Class
  class Model<T> implements ModelType<T> {
    name: string
    properties: Partial<T>
    constructor(object: T) {
      this.properties = object
    }
    [key: string]: any
    as: (alias: string) => AliasModelType<T>
    count?: (() => Promise<number>) | undefined
    create?: (() => Promise<any>) | undefined
    deleteMany?: (() => Promise<any>) | undefined
    deleteOne?: (() => Promise<any>) | undefined
    distinct?: (() => Promise<T[]>) | undefined
    exists?: (() => Promise<boolean>) | undefined
    find?: (() => Promise<T[]>) | undefined
    findById?: (() => Promise<T>) | undefined
    findByIdAndDelete?: (() => Promise<any>) | undefined
    findByIdAndRemove?: (() => Promise<any>) | undefined
    findByIdAndUpdate?: (() => Promise<T>) | undefined
    findOne?: (() => Promise<T>) | undefined
    findOneAndDelete?: (() => Promise<any>) | undefined
    findOneAndRemove?: (() => Promise<any>) | undefined
    findOneAndReplace?: (() => Promise<T>) | undefined
    findOneAndUpdate?: (() => Promise<T>) | undefined
    insertMany?: (() => Promise<any>) | undefined
    update?: (() => Promise<T>) | undefined
    updateMany?: (() => Promise<T[]>) | undefined
    updateOne?: (() => Promise<T>) | undefined
    static as: (alias: string) => AliasModelType<T>
    static count?: (() => Promise<number>) | undefined
    static create?: (() => Promise<any>) | undefined
    static deleteMany?: (() => Promise<any>) | undefined
    static deleteOne?: (() => Promise<any>) | undefined
    static distinct?: (() => Promise<T[]>) | undefined
    static exists?: (() => Promise<boolean>) | undefined
    static find?: (() => Promise<T[]>) | undefined
    static findById?: (() => Promise<T>) | undefined
    static findByIdAndDelete?: (() => Promise<any>) | undefined
    static findByIdAndRemove?: (() => Promise<any>) | undefined
    static findByIdAndUpdate?: (() => Promise<T>) | undefined
    static findOne?: (() => Promise<T>) | undefined
    static findOneAndDelete?: (() => Promise<any>) | undefined
    static findOneAndRemove?: (() => Promise<any>) | undefined
    static findOneAndReplace?: (() => Promise<T>) | undefined
    static findOneAndUpdate?: (() => Promise<T>) | undefined
    static insertMany?: (() => Promise<any>) | undefined
    static name?: string | undefined
    static update?: (() => Promise<T>) | undefined
    static updateMany?: (() => Promise<T[]>) | undefined
    static updateOne?: (() => Promise<T>) | undefined
    save() {}
  })

user

export default Model
