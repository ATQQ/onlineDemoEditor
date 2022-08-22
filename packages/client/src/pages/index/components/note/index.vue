<template>
  <div id="note-editor"></div>
</template>
<script setup lang="ts">
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Embed from '@editorjs/embed'
import Image from '@editorjs/image'
import Checklist from '@editorjs/checklist'
import Code from '@editorjs/code'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import Link from '@editorjs/link'
import underline from '@editorjs/underline'
import { onMounted, ref, watchEffect } from 'vue'
import { useNoteStore } from '@/store'

const props = defineProps<{
  data?: any
}>()
const $noteStore = useNoteStore()
const editor = ref<EditorJS>(null as any)
watchEffect(() => {
  if (props.data && editor.value) {
    $noteStore.updateNote(props.data)
    editor.value?.render(props.data)
  }
})
onMounted(() => {
  const _editor = new EditorJS({
    holder: 'note-editor',
    placeholder: '在这里开始记录你的笔记',
    /**
         onReady callback
        */
    onReady: () => {
      console.log('Editor.js is ready to work!')
      // 内容初始化
      editor.value = _editor
      editor.value.render($noteStore.note)
    },
    /**
     * onChange callback
     */
    onChange: (api, e) => {
      editor.value
        .save()
        .then((outputData) => {
          $noteStore.updateNote(outputData)
        })
        .catch((error) => {
          console.log('Saving failed: ', error)
        })
    },
    tools: {
      header: Header,
      list: List,
      embed: Embed,
      image: Image,
      checklist: Checklist,
      code: Code,
      marker: Marker,
      inlineCode: InlineCode,
      link: Link,
      underline
    },
    i18n: {
      // 国际化相关配置
    }
  })
})
</script>
<style scoped>
#note-editor {
  background-color: aliceblue;
  padding-left: 10px;
  height: 95vh;
}
</style>
