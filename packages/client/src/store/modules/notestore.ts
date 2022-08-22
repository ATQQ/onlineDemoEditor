import { OutputData } from '@editorjs/editorjs'
import { defineStore } from 'pinia'

const useStore = defineStore('note', {
  state: () => ({
    note: {
      version: '',
      time: 0,
      blocks: []
    } as OutputData
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
