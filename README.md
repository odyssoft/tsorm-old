# TSORM

TypeScript ORM for MySQL with node.js

## Installation

```bash
npm install @odyssoft/tsorm
```

## Usage

- Create "database" and "database/models" folders.
- Create and export the models required for your project.

### Database/models/user.ts

```typescript
import { createModel } from '@odyssoft/tsorm'

export interface IUser {
  userId?: string // Primary key, not required for inserts but will be attached to results
  name: string //  Will be required for both insert and result
  age: number // Will be required for both insert and result
}

export const User = createModel<IUser>('user', {
  userId: {
    type: 'INT',
    autoIncrement: true,
    primaryKey: true,
    required: true,
  },
  age: {
    required: true,
    type: 'INT',
  },
  name: {
    required: true,
    type: 'VARCHAR',
    length: 255,
  },
})
```

### Database/index.ts

```typescript
import { createSchema } from '@odyssoft/tsorm'
import { IUser, user } from './models'

interface IMySchema {
  user: IUser
}

export const MySchema = createSchema<IMySchema>(
  'my_schema',
  {
    host: 'localhost',
    port: 3306,
    user: 'YOUR_DATABASE_USER',
    password: 'YOUR_DATABASE_PASSWORD',
  },
  {
    user,
  }
)

export const { user: User } = MySchema.models
```

### routes/user.ts

```typescript
import { Request, Response, Router } from 'express'
import { User } from '../database'

const router = Router()

const UserRoutes = () => {
  router.get('/:id', ({ params: { id } }: Request, res: Response) => {
    User.select({ $where: { userId: id } })
      .then(([result]) => res.json({ result }))
      .catch((error: any) => res.json({ error }))
  })

  router.post('/', ({ body: { name, email } }: Request, res: Response) => {
    User.insert({ name, email })
      .then(([result]) => res.json({ result }))
      .catch((error: any) => res.json({ error }))
  })

  return router
}

export default UserRoutes
```
