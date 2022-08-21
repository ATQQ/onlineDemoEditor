import { FilterQuery, UpdateQuery } from 'mongodb'
import {
  findCollection,
  insertCollection,
  updateCollection
} from '@/lib/dbConnect/mongodb'
import { Code } from './model'
import { getUniqueKey } from '@/utils/stringUtil'

export function addCode(data: Partial<Code>) {
  Object.assign<any, Partial<Code>>(data, {
    id: getUniqueKey()
  })
  return insertCollection<any>('code', data).then(() => data)
}

export function findCode(data: FilterQuery<Code>) {
  return findCollection<Code>('code', data)
}

export function updateCode(query: FilterQuery<Code>, data: UpdateQuery<Code>) {
  return updateCollection<Code>('code', query, data)
}
