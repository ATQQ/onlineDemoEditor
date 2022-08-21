import { OutputData } from '@editorjs/editorjs'
import { defineStore } from 'pinia'

const useStore = defineStore<'note', { note: OutputData }>('note', {
  state: () => ({
    note: {
      blocks: [
        {
          id: '4dvUJDWoEd',
          type: 'header',
          data: { text: '示例笔记', level: 1 }
        },
        {
          id: 'vhzqOCDZSx',
          type: 'header',
          data: { text: '二级标题', level: 2 }
        },
        {
          id: 'dURIQHC383',
          type: 'header',
          data: { text: '三级标题', level: 3 }
        },
        {
          id: '7UO6-0jH-C',
          type: 'paragraph',
          data: { text: '<b>加粗内容</b>' }
        },
        {
          id: 'qPA_4V0ZSd',
          type: 'paragraph',
          data: { text: '<i>斜体字</i>' }
        },
        {
          id: 'PS5zQWURyQ',
          type: 'paragraph',
          data: { text: '高亮<mark class="cdx-marker">部分</mark>内容' }
        },
        {
          id: 'OKK8qI9-mm',
          type: 'paragraph',
          data: { text: '部分<code class="inline-code">代码</code>标记' }
        },
        {
          id: 'Wmm9e1_C-k',
          type: 'paragraph',
          data: { text: '部分<u class="cdx-underline">下划线</u>' }
        }
      ],
      version: '',
      time: 0
    }
  }),
  actions: {
    updateNote(payload: OutputData) {
      console.log('updateNote', payload)

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
