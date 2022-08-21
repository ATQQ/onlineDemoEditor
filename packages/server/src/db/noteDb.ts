import { FilterQuery, UpdateQuery } from 'mongodb'
import {
  findCollection,
  insertCollection,
  updateCollection
} from '@/lib/dbConnect/mongodb'
import { Note } from './model'
import { getUniqueKey } from '@/utils/stringUtil'

export function addNote(data: Partial<Note>) {
  Object.assign<any, Partial<Note>>(data, {
    id: getUniqueKey()
  })
  return insertCollection<any>('note', data).then(() => data)
}

export function findNote(data: FilterQuery<Note>) {
  return findCollection<Note>('note', data)
}

export function updateNote(query: FilterQuery<Note>, data: UpdateQuery<Note>) {
  return updateCollection<Note>('note', query, data)
}
