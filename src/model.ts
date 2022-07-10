import { ModelKeys, ModelType } from './@types/model'

function Model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
  return {
    delete: () => {},
    find: () => {},
  }
}

type TestClass = {
  name: string
  age: number

  testFunc: () => void
}

class Test {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  static testFunc() {}
  static {
    console.log('static called')
  }
}

const testModel = new Test('test', 1)
const testModel2 = Test.testFunc()
