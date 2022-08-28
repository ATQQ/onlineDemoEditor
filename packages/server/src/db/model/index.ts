import type { OutputData } from '@editorjs/editorjs'

export interface User {
  id: string
  username: string
  password: string
  phone?: string
}

export interface Demo {
  userId: string

  id: string
  title: string
  des?: string
  share?: boolean
  forkFrom?: string

  noteId: string
  codeId: string
}

export interface Note {
  userId: string

  id: string
  data: OutputData
}

export interface Code {
  userId: string

  id: string
  js: string
  css: string
  html: string
}
