import User, { IUser } from 'example/models/user'
import { AliasModelKeys, Where } from './'

export type DeleteOptions<T, A = any> = Where<T, A>

export type Delete<T> = (options: DeleteOptions<T>) => void

User.as<'u'>('u').delete({
  $or: [
    {
      'u.age': {
        $between: { min: 0, max: 10 },
      },
    },
    {
      'u.name': {
        $like: '%foo%',
      },
    },
  ],
})
