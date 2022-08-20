<template>
  <div class="layout">
    <header>
      <el-button 
      @click="showNoteList=!showNoteList"
      class="control-note-list" 
      :type='showNoteList?"primary":"default"' 
      :icon="showNoteList?Expand:Fold" 
      circle />
      <span style="color: #fff;">（v{{version}}）还在开发中。。。。</span>
      <el-button disabled>分享</el-button>
      <el-button disabled>测试</el-button>
    </header>
    <main>
      <div class="note-list" v-show="showNoteList">
        <div class="control">
          <el-button @click="handleAddNote">新增</el-button>
        </div>
        <ul>
          <li @click="handleChangeNote(v)" v-for="(v) in noteList" :key="v.id" :class="{ active: v.id === activeNote }">{{ v.value }}</li>
        </ul>
      </div>
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
    </main>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Expand,Fold } from '@element-plus/icons-vue'
import { ElMessageBox,ElMessage } from 'element-plus'
import Note from './components/note/index.vue'
import CodeEditor from './components/editor/index.vue'
import RenderPage from './components/render/index.vue'
import {version} from '../../../package.json'

const showNoteList = ref(true)
const noteList = reactive([
  {
    id: 1,
    value: '测试1',
  },
  {
    id: 2,
    value: '测试2',
  }
])

const activeNote = ref(1)

const handleAddNote = ()=>{
  ElMessageBox.prompt('输入笔记名称', '新增笔记', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern:/^.{1,10}$/,
    inputErrorMessage: '1-10个字符',
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        message: `新增 ${value} 成功`,
      })
      noteList.push({
        id:noteList.length,
        value
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
} 
const handleChangeNote = (v:any)=>{
  activeNote.value = v.id
}
onMounted(() => {
  // 接口拉数据
})
</script>
<style scoped lang="scss">
.note-list {
  width: 200px;
  padding: 10px;
  box-sizing: border-box;

  .control {
    text-align: center;
    margin-bottom: 10px;
  }

  ul li {
    padding: 10px;
    line-height: 20px;
    font-size: 13px;
    font-weight: 500;
    color: #606266;
    transition: color .5s;
    cursor: pointer;
  }

  ul li:hover {
    color: #409eff;
  }

  ul li.active {
    color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
  }
}

header {
  background-color: #3c3c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: relative;
}

.control-note-list {
  position: absolute;
  left: 20px;
}

main {
  display: flex;
}

.note {
  background-color: rgba(255, 220, 23, 0.773);
}

.code {
  background-color: #000;
}

.render {
  background-color: rgb(43, 191, 254);
}

.container {
  width: 33%;
  flex: 1;
}
</style>
