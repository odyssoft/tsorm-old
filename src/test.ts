import { OkPacket, FieldPacket } from 'mysql2/promise'
import { IUser, User } from './mocks'

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
const selectAllResult = User.select().then((users) => {
  //  do something with users
})
const selectResult = User.select({
  $columns: ['username', 'email'],
}).then(() => {})
const selectColumnsResult = User.select().then(() => {})
const truncateResult = User.truncate().then(() => {})
const updateResult = User.update().then(() => {})
const upsertResult = User.upsert().then(() => {})
const upsertOneResult = User.upsertOne().then(() => {})
const upsertManyResult = User.upsertMany().then(() => {})
