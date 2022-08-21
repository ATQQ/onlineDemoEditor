<template>
  <div class="layout">
    <header>
      <el-button
        @click="showNoteList = !showNoteList"
        :type="showNoteList ? 'primary' : 'default'"
        :icon="showNoteList ? Expand : Fold"
        circle
      />
      <div class="top-tools">
        <span class="tip">{{ tipText }}</span>
        <div v-if="!isLogin">
          <el-button type="success" @click="showLoginDialog = true"
            >登录</el-button
          >
        </div>
        <div v-else>
          <el-button disabled>分享</el-button>
          <el-button disabled>保存</el-button>
        </div>
      </div>
      <el-link
        type="primary"
        href="https://github.com/ATQQ/onlineDemoEditor"
        target="_blank"
        >GitHub</el-link
      >
    </header>
    <main>
      <div class="note-list" v-show="showNoteList">
        <div v-if="isLogin">
          <div class="control">
            <el-button @click="handleAddNote">新增</el-button>
          </div>
          <ul>
            <li
              @click="handleChangeNote(v)"
              v-for="v in noteList"
              :key="v.id"
              :class="{ active: v.id === activeNote }"
            >
              {{ v.value }}
            </li>
          </ul>
        </div>
        <div v-else class="no-logon">
          <p class="title">请先进行登录</p>
          <p>登录后才能<strong>编写笔记</strong></p>
          <p>登录后才能<strong>保存数据</strong></p>
        </div>
      </div>
      <!-- TODO：失去焦点时自动保存，格式化 -->
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
    <el-dialog v-model="showLoginDialog" title="登录" width="400px" center>
      <el-form
        label-position="right"
        label-width="50px"
        :model="userForm"
        style="max-width: 460px"
      >
        <el-form-item label="账号">
          <el-input
            v-model="userForm.username"
            clearable
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            clearable
            show-password
          />
        </el-form-item>
      </el-form>
      <p style="text-align: center">
        未注册账号，将自动进行注册（6-16字母数字）
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showLoginDialog = false">取消</el-button>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import Note from './components/note/index.vue'
import CodeEditor from './components/editor/index.vue'
import RenderPage from './components/render/index.vue'
import { version } from '../../../package.json'
import { useUserStore } from '@/store'

const $userStore = useUserStore()
const isLogin = computed(() => $userStore.isLogin)
const showNoteList = ref(true)
const noteList = reactive([
  {
    id: 1,
    value: '测试1'
  },
  {
    id: 2,
    value: '测试2'
  }
])

const activeNote = ref(1)

const handleAddNote = () => {
  ElMessageBox.prompt('输入笔记名称', '新增笔记', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^.{1,10}$/,
    inputErrorMessage: '1-10个字符'
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        message: `新增 ${value} 成功`
      })
      noteList.push({
        id: noteList.length + 1,
        value
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      })
    })
}
const handleChangeNote = (v: any) => {
  activeNote.value = v.id
}
const tipText = computed(() => {
  return isLogin.value ? `欢迎，${$userStore.account}💐` : '请先登录 => '
})

const showLoginDialog = ref(false)
const userForm = reactive({
  username: '',
  password: ''
})
const handleLogin = () => {
  if (
    validateUsername(userForm.username) ||
    validatePassword(userForm.password)
  ) {
    ElMessage.error('账号或密码格式不正确')
  }
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
    transition: color 0.5s;
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
  justify-content: space-between;
  padding: 10px 30px 10px 10px;
  position: relative;
  .top-tools {
    display: flex;
    justify-content: center;
    align-items: center;
    .tip {
      margin: 0 20px;
      color: #fff;
    }
  }
}

.control-note-list {
  position: absolute;
  left: 20px;
}

main {
  display: flex;
  .no-logon {
    text-align: center;
    color: #606266;
    p {
      font-size: 15px;
      padding: 10px;
    }
    p.title {
      font-size: 20px;
    }
  }
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
