import { KeyOf, ModelKeys } from './'

export function createModel<T>(name: string, keys: ModelKeys<T>) {
  return class Model {
    constructor(data: T) {
      Object.assign(this, data)
    }

    public save(): T {
      return {} as T
    }

    public static find() {}
    public static findBy(key: KeyOf<T>, value: any) {}
    public static findById() {}
    public static findOne() {}
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
