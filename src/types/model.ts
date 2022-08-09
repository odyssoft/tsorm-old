import Comment, { IComment } from 'example/models/comment'
import Post, { IPost } from 'example/models/post'
import User from 'example/models/user'
import { ColumnOptions, Delete, Indexable, Insert, JoinOptions, KeyOf, Select, Update } from './'

export type AliasModelKeys<T, A extends string> = {
  [K in keyof T as K extends string ? `${A}.${K}` : never]: T[K]
}

export interface AliasModelType<T, A extends string> extends BaseModelType<AliasModelKeys<T, A>> {
  keys: ModelKeys<AliasModelKeys<T, A>>
  join: <S, AA extends string>(
    model: AliasModelType<S, AA>,
    options: JoinOptions<AliasModelKeys<T, A> & AliasModelKeys<S, AA>>
  ) => ModelType<AliasModelKeys<T, A> & AliasModelKeys<S, AA>>
}

export interface BaseModelType<T> {
  [key: string]: any
  keys: ModelKeys<T>
  name: string
  // delete: Delete<T>
  // insert: Insert<T>
  // select: Select<T>
  // update: Update<T>
}

export type ModelKeys<T> = {
  [key in KeyOf<T>]: ColumnOptions
} & Indexable

export interface ModelType<T> extends BaseModelType<T> {
  keys: ModelKeys<T>
  as<A extends string>(alias: string): AliasModelType<T, A>
}

User.as<'u'>('u').join<IPost, 'p'>(Post.as<'p'>('p'), {
  'u.userId': 'p.postId',
})

// User.as<'u'>('u').join<IPost, 'p'>(Post.as<'p'>('p'), {
//   'u.userId': 'p.postId',
// })
//  Rework aliasmodel type as ModelType<AliasModelKeys<T, A>>

// const test = Comment.as<'c'>('c').join<IPost, 'p'>(Post.as<'p'>('p'), {
//   'c.postId': 'p.postId',
// })

// User.as<'u'>('u').join<IComment, 'c'>(Comment.as<'c'>('c'), {})

// const testAlias: KeyOf<AliasModelKeys<IPost, 'p'> & AliasModelKeys<IComment, 'c'>>

// const aliasKeys: KeyOf<AliasModelKeys<IPost, 'p'> & AliasModelKeys<IComment, 'c'>>
