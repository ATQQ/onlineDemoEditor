<template>
  <div class="layout">
    <!-- 写笔记 -->
    <div class="note container">
      <Note />
    </div>
    <!-- 写代码 -->
    <div class="code container">
      <CodeEditor />
    </div>
    <!-- 代码渲染结果 -->
    <div class="render container">
      <RenderPage />
    </div>
  </div>
</template>
<script setup lang="ts">
import Note from './components/note/index.vue'
import CodeEditor from './components/editor/index.vue'
import RenderPage from './components/render/index.vue'
</script>
<style scoped lang="scss">
.layout{
  display: flex;
}
.note{
  background-color: rgba(255, 220, 23, 0.773);
}
.code{
  background-color: #000;
}
.render{
  background-color: rgb(43, 191, 254);
}
.container{
  width: 33%;
  flex: 1;
}
</style>
