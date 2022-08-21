import { FilterQuery, UpdateQuery } from 'mongodb'
import {
  findCollection,
  insertCollection,
  updateCollection
} from '@/lib/dbConnect/mongodb'
import { User } from './model/user'
import { getUniqueKey } from '@/utils/stringUtil'

export function addUser(user: Partial<User>) {
  Object.assign<any, Partial<User>>(user, {
    id: getUniqueKey()
  })
  return insertCollection<any>('user', user)
}

export function findUser(user: FilterQuery<User>) {
  return findCollection<User>('user', user)
}

export function updateUser(query: FilterQuery<User>, user: UpdateQuery<User>) {
  return updateCollection<User>('user', query, user)
}
