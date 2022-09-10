import { KeyOf, ModelKeys } from './'

export function createModel<T>(name: string, keys: ModelKeys<T>) {
  return class Model {
    constructor(data: T) {
      Object.assign(this, data)
    }

    public save(): T {
      return {} as T
    }

    public static create(): T {
      return {} as T
    }
    public static createMany(): T[] {
      return [{}] as T[]
    }

    public static deleteMany(): number {
      return 0
    }
    public static deleteOne(): boolean {
      return false
    }
    public static deleteBy(): boolean {
      return false
    }
    public static deleteById(): boolean {
      return false
    }

    public static find(): T | T[] {
      return {} as T
    }
    public static findBy(key: KeyOf<T>, value: any): T | T[] {
      return {} as T
    }
    public static findById(): T {
      return {} as T
    }
    public static findOne(): T {
      return {} as T
    }
    public static findOneBy(): T {
      return {} as T
    }

    public static updateMany(): T[] {
      return [{}] as T[]
    }
    public static updateOne(): T {
      return {} as T
    }
    public static updateOneBy(): T {
      return {} as T
    }
  }
}

interface IUser {
  userId?: number
  username: string
  forename: string
  surname: string
  email: string
  password?: string
}

const User = createModel<IUser>('user', {
  userId: {
    primaryKey: true,
    autoIncrement: true,
    type: 'INT',
  },
  username: {
    type: 'VARCHAR',
    length: 40,
    required: true,
    unique: true,
  },
  email: {
    type: 'VARCHAR',
    length: 310,
    required: true,
    unique: true,
  },
  forename: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  surname: {
    type: 'VARCHAR',
    length: 255,
    required: true,
  },
  password: {
    type: 'VARCHAR',
    length: 500,
    required: true,
  },
})

const user: IUser = new User({
  email: 'test@test.com',
  forename: 'Test',
  surname: 'User',
  username: 'testuser',
  password: 'password',
}).save()

// User.find()
