import MySchema from 'example/schema'
import { AliasModelClass, ModelKeys, ModelType } from './@types/model'

declare class ModelClass<T> {
  keys: ModelKeys<T>
  name: string
  properties: Partial<T>
  constructor(data: T)
  as?(alias: string): AliasModelClass<T>
  count?(options?: any): Promise<number>
  create?(data: T): Promise<any>
  deleteMany?(options?: any): Promise<any>
  deleteOne?(options: any): Promise<any>
  distinct?(options: any): Promise<T[]>
  exists?(options: any): Promise<boolean>
  find?(options?: any): Promise<T[]>
  findById?(id: number): Promise<T>
  findByIdAndDelete?(id: number): Promise<any>
  findByIdAndRemove?(id: number): Promise<any>
  findByIdAndUpdate?(id: number, data: T): Promise<T>
  findOne?(options: any): Promise<T>
  findOneAndDelete?(options: any): Promise<any>
  findOneAndRemove?(options: any): Promise<any>
  findOneAndReplace?(options: any): Promise<T>
  findOneAndUpdate?(options: any): Promise<T>
}

export function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
  class Model<S> implements ModelClass<T> {
    keys: ModelKeys<T> = keys
    name: string = name
    properties: Partial<T>
    constructor(data: S) {
      this.properties = data
    }

    static as(alias: string): AliasModelClass<T> {
      return <AliasModelClass<T>>(<any>Model)
    }
    static count(options?: any): Promise<number> {
      return Promise.resolve(0)
    }
    static create(data: T): Promise<any> {
      return Promise.resolve({} as T)
    }
    static deleteMany(options?: any): Promise<any> {
      return Promise.resolve({} as T)
    }
    static deleteOne(options: any): Promise<any> {
      return Promise.resolve({} as T)
    }
    static distinct(options: any): Promise<T[]> {
      return Promise.resolve([] as T[])
    }
    static exists(options: any): Promise<boolean> {
      return Promise.resolve(true)
    }
    static find(options?: any): Promise<T[]> {
      return Promise.resolve([] as T[])
    }
    static findById(id: number): Promise<T> {
      return Promise.resolve({} as T)
    }
    static findByIdAndDelete(id: number): Promise<any> {
      return Promise.resolve({} as T)
    }
    static findByIdAndRemove(id: number): Promise<any> {
      return Promise.resolve({} as T)
    }
    static findByIdAndUpdate(id: number, data: T): Promise<T> {
      return Promise.resolve({} as T)
    }
    static findOne(options: any): Promise<T> {
      return Promise.resolve({} as T)
    }
    static findOneAndDelete(options: any): Promise<any> {
      return Promise.resolve({} as T)
    }
    static findOneAndRemove(options: any): Promise<any> {
      return Promise.resolve({} as T)
    }
    static findOneAndReplace(options: any): Promise<T> {
      return Promise.resolve({} as T)
    }
    static findOneAndUpdate(options: any): Promise<T> {
      return Promise.resolve({} as T)
    }
    static insertMany(data: T[]): Promise<any> {
      return Promise.resolve({} as T)
    }
    static update(data: T | T[], options: any): Promise<T> {
      return Promise.resolve({} as T)
    }
    static updateMany(data: T[]): Promise<T[]> {
      return Promise.resolve([] as T[])
    }
    static updateOne(data: T): Promise<T> {
      return Promise.resolve({} as T)
    }

    save(): Promise<T> {
      return Promise.resolve(this.properties as T)
    }
  }
  return {
    keys,
    name,
    model: Model<T>,
  }
}

interface IUser {
  name: string
  password: string
  age: number
}

const user = model<IUser>('user', {
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

const User: ModelClass<IUser> = MySchema.addModel(user)

const test = new User({})

// const user = new User({
//   name: 'John',
//   password: 'asdamsdoi',
//   age: 18,
// })

export default model
