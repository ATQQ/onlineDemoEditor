import { FilterQuery, UpdateQuery } from 'mongodb'
import {
  findCollection,
  insertCollection,
  updateCollection
} from '@/lib/dbConnect/mongodb'
import { Demo } from './model'
import { getUniqueKey } from '@/utils/stringUtil'
import { addNote } from './noteDb'
import { addCode } from './codeDb'

export function addDemo(data: Partial<Demo>) {
  Object.assign<any, Partial<Demo>>(data, {
    id: getUniqueKey()
  })
  return insertCollection<any>('demo', data).then(() => data)
}

export function findDemo(data: FilterQuery<Demo>) {
  return findCollection<Demo>('demo', data)
}

export function updateDemo(query: FilterQuery<Demo>, data: UpdateQuery<Demo>) {
  return updateCollection<Demo>('demo', query, data)
}

export async function createDefaultDemo(
  userId: string,
  title?: string,
  forkFrom?: string
) {
  const demoNote = await addNote({
    userId,
    data: {
      blocks: title
        ? [
            {
              id: getUniqueKey(),
              type: 'header',
              data: { text: title, level: 1 }
            }
          ]
        : [
            {
              id: getUniqueKey(),
              type: 'header',
              data: { text: '示例笔记', level: 1 }
            },
            {
              id: getUniqueKey(),
              type: 'header',
              data: { text: '二级标题', level: 2 }
            },
            {
              id: getUniqueKey(),
              type: 'header',
              data: { text: '三级标题', level: 3 }
            },
            {
              id: getUniqueKey(),
              type: 'paragraph',
              data: { text: '<b>加粗内容</b>' }
            },
            {
              id: getUniqueKey(),
              type: 'paragraph',
              data: { text: '<i>斜体字</i>' }
            },
            {
              id: getUniqueKey(),
              type: 'paragraph',
              data: { text: '高亮<mark class="cdx-marker">部分</mark>内容' }
            },
            {
              id: getUniqueKey(),
              type: 'paragraph',
              data: { text: '部分<code class="inline-code">代码</code>标记' }
            },
            {
              id: getUniqueKey(),
              type: 'paragraph',
              data: { text: '部分<u class="cdx-underline">下划线</u>' }
            }
          ],
      version: '',
      time: 0
    }
  })
  const demoCode = await addCode({
    userId,
    html: '<h1>Hello World</h1>',
    css: `h1 {
  color: red;
}`,
    js: 'console.log("Hello World")'
  })
  const demo = await addDemo({
    userId,
    title: title || '示例笔记',
    noteId: demoNote.id,
    codeId: demoCode.id,
    forkFrom
  })
  return demo
}
