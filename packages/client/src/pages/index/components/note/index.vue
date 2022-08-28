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
// import Link from '@editorjs/link'
import underline from '@editorjs/underline'
import { onMounted, ref, watchEffect } from 'vue'
import { useNoteStore, useUserStore } from '@/store'
import { noteApi } from '@/apis'
import { getRandomKey, qiniuUpload } from '@/utils/qiniuUtil'

const props = defineProps<{
  data?: any
  readonly?: boolean
}>()
const $noteStore = useNoteStore()
const $userStore = useUserStore()
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
    readOnly: !!props.readonly,
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
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile(file: File) {
              // return {
              //   success: 1,
              //   file: {
              //     url: 'https://img.cdn.sugarat.top/online-editor/6302403434e52962875fbf3e/1661169105550/pupza3m486'
              //   }
              // }
              return noteApi.getUploadToken().then((uploadTokenData) => {
                const { token, domain, minify } = uploadTokenData.data
                const key = `online-editor/${
                  $userStore.userId
                }/${Date.now()}/${getRandomKey()}`
                return qiniuUpload(token, file, key).then(() => {
                  return {
                    success: 1,
                    file: {
                      url: `${domain}/${key}${minify}`
                    }
                  }
                })
              })
            }
          }
        }
      },
      checklist: Checklist,
      code: Code,
      marker: Marker,
      inlineCode: InlineCode,
      underline
    },
    i18n: {
      // 国际化相关配置
    }
  })
})
</script>
<style scoped lang="scss">
#note-editor {
  background-color: aliceblue;
  padding-left: 20px;
  padding-right: 0;
  width: 100%;
  min-width: 100px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  // :deep(.ce-block__content) {
  //   margin-left: 6px;
  //   margin-right: 0;
  // }
}
</style>
