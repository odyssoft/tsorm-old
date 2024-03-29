[![Codecov Coverage](https://img.shields.io/codecov/c/github/odyssoft/tsorm/main.svg?style=flat-square)](https://codecov.io/gh/odyssoft/tsorm/)

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
  create: true, //  optional for when you want to create the schema and tables. (creating schemas and tables every server (re)start is not necessary)
})
```

### Database/models/user.ts

```typescript
import { DataTypes } from '@odyssoft/tsorm'
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
    type: DataTypes.int,
  },
  username: {
    type: DataTypes.varchar(40),
    required: true,
    unique: true,
  },
  email: {
    type: DataTypes.varchar(310),
    required: true,
    unique: true,
  },
  password: {
    type: DataTypes.varchar(500),
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

## Views

### Database/views/userpost.ts

```typescript
import { DataTypes } from '@odyssoft/tsorm'

import { User, Post } from '../models'
import mySchema from '../schema'

export interface IUserPost {
  userId: number
  username: string
  postId: number
  title: string
}

export const UserPost = mockSchema.createView<IUserPost>(
  'userpost',
  ['userId', 'username', 'postId', 'title'],
  User.as('U')
    .join(Post.as('P'), 'U.userId', 'P.userId')
    .select('U.userId', 'U.username', 'P.postId', 'P.title')
)
```

### Query examples

```typescript
import { OkPacket, FieldPacket } from 'mysql2/promise'
import { User } from '../database/models/user'

const insertResult = User.insert({
  email: 'example@example.com',
  password: 'example',
  username: 'example',
}).then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const insertMultipleResult = User.insert([
  {
    email: 'example@example.com',
    password: 'example',
    username: 'example',
  },
  {
    email: 'example2@example.com',
    password: 'another_example',
    username: 'random',
  },
]).then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const createResult = User.create({
  email: 'example@example.com',
  password: 'example',
  username: 'example',
}).then((user) => {
  //  do something with user
})

const createManyResult = User.createMany([
  {
    email: 'example@example.com',
    password: 'example',
    username: 'example',
  },
  {
    email: 'example2@example.com',
    password: 'another_example',
    username: 'random',
  },
]).then((users) => {
  //  do something with users
})

const deleteResult = User.delete({
  userId: 1,
}).then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const deleteByResult = User.deleteBy('email', {
  $like: '%example.com',
}).then((count) => {
  //  do something with count
})

const deleteByIdResult = User.deleteById(1).then((deleted: boolean) => {
  //  do something if user was deleted
})

const deleteOneResult = User.deleteOne({
  userId: {
    $between: {
      min: 1,
      max: 3,
    },
  },
}).then((deleted: boolean) => {
  //  do something if user was deleted
})

const deleteOneByResult = User.deleteOneBy('username', 'random').then((deleted: boolean) => {
  //  do something if user was deleted
})

const findAllResult = User.find().then((users) => {
  //  do something with users
})

const findResult = User.find({
  email: {
    $like: '%example.com',
  },
}).then((users) => {
  //  do something with users
})

const findByResult = User.findBy('username', 'random').then((users) => {
  //  do something with users
})

const findByIdResult = User.findById(2).then((user) => {
  //  do something with user
})

const findOneResult = User.findOne({
  username: 'random',
}).then((user) => {
  //  do something with user
})

const findOneByResult = User.findOneBy('email', {
  $like: '%example.com',
}).then((user) => {
  //  do something with user
})

const selectAllResult = User.select().then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const selectResult = User.select({
  $columns: ['username', 'email'],
}).then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const selectColumnsResult = User.select().then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const truncateResult = User.truncate().then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const updateResult = User.update(
  {
    email: 'updated@example.com',
  },
  {
    userId: 1,
  }
).then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const upsertResult = User.upsert({
  email: 'example@example.com',
  password: 'example',
  username: 'example',
}).then(([okPacket, fieldPacketArray]) => {
  //  handle mysql2 result
})

const upsertOneResult = User.upsertOne({
  email: 'example@example.com',
  password: 'example',
  username: 'example',
}).then((result: boolean) => {
  //  do something on result
})

const upsertManyResult = User.upsertMany([
  {
    email: 'example@example.com',
    password: 'example',
    username: 'example',
  },
  {
    email: 'example2@example.com',
    password: 'another_example',
    username: 'random',
  },
]).then((result) => {
  //  do something on result
})
```

### Where clause

Most of the methods accept a where clause as the first parameter. The where clause is an object that contains the conditions for the query. The keys of the object are the column names and the values are the conditions. The conditions can be a simple value or an object with a single key that is the operator and the value is the value to compare.

```typescript
const whereExample = User.find({
  email: {
    $like: '%example%',
  },
  userId: {
    $lessThanEqual: 4,
  },
  username: {
    $in: ['example', 'random', 'another'],
  },
})
```

### Using Or

```typescript
const orExample = User.find({
  $or: [
    {
      userId: {
        $between: {
          min: 1,
          max: 4,
        },
      },
    },
    {
      userId: 19,
    },
  ],
})
```

### Joins

```typescript
const joinExample = User.as('u')
  .join(Post.as('p'), 'INNER', {
    'u.userId': 'p.userId',
  })
  .select(query)
//  Where query is an optional object containing selected columns and or a where clause
```

### Join query

```typescript
//  An example for the above join select query using both columns and where clause
const query = {
  $columns: ['u.userId', 'u.username', 'p.postId', 'p.content'],
  $where: {
    'u.userId': 1,
    'p.postId': 1,
  },
}
```

The above query would result in the following sql query

```sql
SELECT
u.userId,
u.username,
p.postId,
p.content

FROM
`user` AS u

INNER JOIN
`post` AS p
ON
u.userId = p.userId

WHERE
u.userId = 1
AND
p.postId = 1
```

### Group by, Order by, Limit and Offset

Group by, order by, limit and offset can be added to the query on the select methods.

```typescript
User.select({
  $columns: [...],
  $where: {...},
  //  $groupBy can be an array or a string
  $groupBy: ['username'],
  //  $orderBy can be an array or a string with optional appended ASC or DESC
  $orderBy: ['username'],
  //  $limit can be a string or an array where the array is [offset, limit]
  $limit: 10,
})
```
