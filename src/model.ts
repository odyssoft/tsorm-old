import { AliasModelType, ModelKeys, ModelType } from './@types/model'

function createModel<T>(name: string, keys: ModelKeys<T>) {
  return class Model implements ModelType<T> {
    keys: ModelKeys<T> = keys
    name: string = name
    properties: Partial<T>
    constructor(data: T) {
      this.properties = data
    }
    static as(alias: string): AliasModelType<T> {
      return <AliasModelType<T>>(<any>Model)
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

const user = new User({
  name: 'John',
  password: 'asdamsdoi',
  age: 18,
})

export default createModel
