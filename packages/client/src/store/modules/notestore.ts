import { OutputData } from '@editorjs/editorjs'
import { defineStore } from 'pinia'

const useStore = defineStore('note', {
  state: () => ({
    note: {
      version: '',
      time: 0,
      blocks: []
    } as OutputData,
    defaultNote: {
      blocks: [
        {
          type: 'header',
          data: { text: '示例笔记', level: 1 }
        },
        {
          type: 'header',
          data: { text: '二级标题', level: 2 }
        },
        {
          type: 'header',
          data: { text: '三级标题', level: 3 }
        },
        {
          type: 'paragraph',
          data: { text: '<b>加粗内容</b>' }
        },
        {
          type: 'paragraph',
          data: { text: '<i>斜体字</i>' }
        },
        {
          type: 'paragraph',
          data: { text: '高亮<mark class="cdx-marker">部分</mark>内容' }
        },
        {
          type: 'paragraph',
          data: { text: '部分<code class="inline-code">代码</code>标记' }
        },
        {
          type: 'paragraph',
          data: { text: '部分<u class="cdx-underline">下划线</u>' }
        }
      ].map((block) => ({
        ...block,
        id: Math.random().toString(36).substr(2)
      }))
    }
  }),
  actions: {
    updateNote(payload: OutputData) {
      this.note = payload
    },
    clear() {
      this.note = {
        blocks: [],
        version: '',
        time: 0
      }
    }
  }
})

export default useStore
