import {
  AliasModelKeys,
  AliasModelType,
  JoinOptions,
  ModelKeys,
  ModelType,
  UpdateOptions,
  Where,
} from './types'

export function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
  return {
    joinOptions: [],
    keys,
    name,

    as<A extends string>(alias: string): AliasModelType<T, A> {
      return <AliasModelType<T, A>>(<any>{
        ...this,
        join<S, AA extends string>(
          model: AliasModelType<S, AA>,
          options: JoinOptions<AliasModelKeys<T, A> & AliasModelKeys<S, AA>>
        ) {
          return join<AliasModelType<T, A>, AliasModelKeys<T, A>, S, AA>(
            <ModelType<AliasModelType<T, A>>>(<any>this),
            model,
            options
          )
        },
      })
    },
  }
}

function join<T, K, S, A extends string>(
  original: ModelType<T>,
  model: AliasModelType<S, A>,
  options: JoinOptions<K & AliasModelKeys<S, A>>
): ModelType<K & AliasModelKeys<S, A>> {
  original.joinOptions.push(`JOIN ${model.name} ON `) //  Add option parsing here
  return <ModelType<K & AliasModelKeys<S, A>>>(<any>original)
}

// export function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
//   return {
//     joinOptions: [],
//     keys,
//     name,

//     as<A extends string>(alias: string): AliasModelType<T, A> {
//       return {
//         ...(<AliasModelType<T, A>>(<any>this)),
//         alias,
//         join: <S, AA extends string>(
//           model: AliasModelType<S, AA>,
//           options: JoinOptions<AliasModelKeys<T, A> & AliasModelKeys<S, AA>>
//         ): ModelType<AliasModelKeys<T, A> & AliasModelKeys<S, AA>> => {
//           return <ModelType<AliasModelKeys<T, A> & AliasModelKeys<S, AA>>>(<any>this)
//         },
//       }
//     },
//   }
// }

// export function model<T>(name: string, keys: ModelKeys<T>): ModelType<T> {
//   return {
//     name,
//     keys,
//     joinOptions: [],
//     as<A extends string>(alias: string): AliasModelType<T, A> {
//       this.alias = alias
//       return {
//         ...model<AliasModelKeys<T, A>>(name, keys),
//         join<S, AA extends string>(model: AliasModelType<S, AA>, options: JoinOptions<AliasModelKeys<T, A> & AliasModelKeys<S AA>>) {

//         },
//       }
//     },
//     delete(options: Where<T>) {},
//     insert(data: T | T[]) {},
//     join<S, A extends string>(
//       model: AliasModelType<S, A>,
//       options: JoinOptions<T & AliasModelKeys<S, A>>
//     ) {
//       // this.keys = { ...this.keys, ...model.keys }
//       // this.joinOptions.push(options)
//       return <ModelType<T & AliasModelKeys<S, A>>>(<any>this)
//     },
//     select() {},
//     update(data: T | T[], options?: UpdateOptions<T>) {},
//   }
// }

export default model
