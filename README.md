# TSORM

TypeScript ORM for MySQL with node.js

## Installation

```bash
npm install @odyssoft/tsorm
```

## Usage

- Create Schema file
- Create and export the models required for your project.

### Database/schema.ts

```typescript
import { Schema } from '@odyssoft/tsorm'

export const mySchema = new Schema('my_schema', {
  host: 'localhost',
  password: 'password',
  port: 3306,
  user: 'root',
})
```

### Database/models/user.ts

```typescript
import mySchema from '../schema'

export interface IUser {
  userId?: number
  username: string
  email: string
  password: string
}

export const User = mockSchema.createModel<IUser>('user', {
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
  password: {
    type: 'VARCHAR',
    length: 500,
    required: true,
  },
})
```

### routes/user.ts

```typescript
import { Request, Response, Router } from 'express'
import { User } from '../database'

const router = Router()

const UserRoutes = () => {
  router.get('/:id', ({ params: { id } }: Request, res: Response) =>
    User.find({ $where: { userId: id } })
      .then((user) => res.json(user))
      .catch((error: any) => res.json({ error }))
  )

  router.post('/', ({ body: { name, email, password } }: Request, res: Response) =>
    User.create({ name, email, password: encryptPassword(password) })
      .then((user) => res.json(user))
      .catch((error: any) => res.json({ error }))
  )

  return router
}

export default UserRoutes
```

### Query examples

```typescript
import { User } from '../database/models/user'

User.insert()
User.create()
User.createMany()
User.delete()
User.deleteBy()
User.deleteById()
User.deleteOne()
User.deleteOneBy()
User.find()
User.findBy()
User.findById()
User.findOne()
User.findOneBy()
User.select()
User.truncate()
User.update()
User.upsert()
User.upsertOne()
User.upsertMany()
```
