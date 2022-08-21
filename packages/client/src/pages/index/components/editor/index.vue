<template>
  <div class="editor-container">
    <div id="html-editor"></div>

    <div class="other-editor">
      <div v-show="activeEditor === 'CSS'" id="css-editor"></div>
      <div v-show="activeEditor === 'JS'" id="js-editor"></div>
    </div>

    <div class="mode">
      <el-radio-group v-model="activeEditor">
        <el-radio-button label="CSS" />
        <el-radio-button label="JS" />
      </el-radio-group>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { onMounted, ref, toRaw, watchEffect } from 'vue'
import { useCodeStore } from '@/store'
import { debounce } from '@/utils/fun'

const $codeStore = useCodeStore()

const htmlEditor = ref<monaco.editor.IStandaloneCodeEditor>(null as any)
const CSSEditor = ref<monaco.editor.IStandaloneCodeEditor>(null as any)
const JSEditor = ref<monaco.editor.IStandaloneCodeEditor>(null as any)

const activeEditor = ref<'隐藏' | 'CSS' | 'JS'>('CSS')
onMounted(() => {
  const delay = 200
  // 从接口拿初始化数据
  htmlEditor.value = monaco.editor.create(
    document.getElementById('html-editor')!,
    {
      value: $codeStore.html,
      language: 'html',
      theme: 'vs-dark',
      fontSize: 18,
      automaticLayout: true
    }
  )
  CSSEditor.value = monaco.editor.create(
    document.getElementById('css-editor')!,
    {
      value: $codeStore.css,
      language: 'css',
      theme: 'vs-dark',
      fontSize: 18,
      automaticLayout: true
    }
  )
  JSEditor.value = monaco.editor.create(document.getElementById('js-editor')!, {
    value: $codeStore.js,
    language: 'typescript',
    theme: 'vs-dark',
    fontSize: 18,
    automaticLayout: true
  })
  toRaw(htmlEditor.value).onDidChangeModelContent(
    debounce(() => {
      $codeStore.updateHtml(toRaw(htmlEditor.value).getValue())
    }, delay)
  )
  toRaw(CSSEditor.value).onDidChangeModelContent(
    debounce(() => {
      $codeStore.updateCss(toRaw(CSSEditor.value).getValue())
    }, delay)
  )
  toRaw(JSEditor.value).onDidChangeModelContent(
    debounce(() => {
      $codeStore.updateJs(toRaw(JSEditor.value).getValue())
    }, delay)
  )
})
</script>
<style scoped lang="scss">
.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

#html-editor {
  width: 100%;
  flex: 1;
}

.other-editor {
  border-top: 1px solid #fff;
  width: 100%;
  height: 40%;
}

#js-editor,
#css-editor {
  border-top: 1px solid #fff;
  width: 100%;
  height: 100%;
}

.mode {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
