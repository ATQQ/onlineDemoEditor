<template>
  <div class="layout">
    <header>
      <div>
        <el-button
          v-if="userMode"
          @click="showNoteList = !showNoteList"
          :type="showNoteList ? 'primary' : 'default'"
          :icon="showNoteList ? Expand : Fold"
          circle
        />
        <el-button
          :disabled="!isLogin && userMode"
          @click="showNoteEditor = !showNoteEditor"
          :type="showNoteEditor ? 'primary' : 'default'"
          :icon="EditPen"
          circle
        />
        <el-button type="primary" text> {{ '<= 控制要展示的面板' }}</el-button>
      </div>
      <div class="top-tools">
        <span class="tip">{{ tipText }}</span>
        <el-button
          :disabled="!isLogin"
          v-if="shareMode"
          type="success"
          @click="handleFork"
          >Fork</el-button
        >
        <el-button
          v-if="!isLogin"
          type="success"
          @click="showLoginDialog = true"
          >登录</el-button
        >
        <el-button
          v-if="isLogin && userMode"
          type="success"
          @click="handleShare"
          >分享</el-button
        >
        <el-button v-if="userMode && isLogin" type="success" @click="handleSave"
          >保存 (Ctrl+S)</el-button
        >
      </div>
      <div>
        <el-link
          type="primary"
          href="https://github.com/ATQQ/onlineDemoEditor"
          target="_blank"
          >GitHub</el-link
        >
        <el-link
          v-if="isLogin"
          class="logout"
          type="danger"
          @click="handleLogout"
          >退出登录</el-link
        >
      </div>
    </header>
    <main>
      <div v-if="userMode" class="note-list" v-show="showNoteList">
        <div v-if="isLogin">
          <div class="control">
            <el-button @click="handleAddNote">新增</el-button>
          </div>
          <ul>
            <li
              @click="handleChangeNote(v)"
              v-for="v in demoList"
              :key="v.id"
              :class="{ active: v.id === activeDemoId }"
            >
              {{ v.title }}
            </li>
          </ul>
        </div>
        <div v-else class="no-logon">
          <p class="title">请先进行登录</p>
          <p>登录后才能<strong>编写笔记</strong></p>
          <p>登录后才能<strong>分享笔记</strong></p>
          <p>登录后才能<strong>保存数据</strong></p>
        </div>
      </div>
      <!-- 写笔记 -->
      <div
        class="note"
        :style="{
          width: (isLogin || shareMode) && showNoteEditor ? '800px' : '0',
          overflow:
            (isLogin || shareMode) && showNoteEditor ? 'visible' : 'hidden'
        }"
      >
        <Note :data="codeData.note" :readonly="shareMode" />
      </div>
      <div class="container">
        <!-- 写代码 -->
        <div
          class="code"
          :style="{
            width: `${codeWidth}px`
          }"
        >
          <CodeEditor
            :html="codeData.html"
            :css="codeData.css"
            :js="codeData.js"
          />
          <div class="touchBar" ref="touchBar"></div>
        </div>
        <!-- 代码渲染结果 -->
        <div class="render">
          <RenderPage />
        </div>
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
    <el-dialog v-model="showShareDialog" title="分享笔记" width="500px" center>
      <div class="share-dialog">
        <div class="item">
          <span>启用分享</span>
          <el-switch
            :value="!!activeDemo?.share"
            class="ml-2"
            inline-prompt
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            active-text="是"
            inactive-text="否"
            @change="handleChangeShare"
          />
        </div>
        <div class="item">
          <el-input v-show="!!activeDemo?.share" v-model="shareLink" disabled>
            <template #append>
              <el-button @click="handleCopyLink">复制</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watchEffect
} from 'vue'
import { Expand, Fold, EditPen } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { validatePassword, validateUsername } from '@share/utils/validate'
import { Demo } from '@server/db/model'
import { useRoute, useRouter } from 'vue-router'
import Note from './components/note/index.vue'
import CodeEditor from './components/editor/index.vue'
import RenderPage from './components/render/index.vue'
import { useCodeStore, useNoteStore, useUserStore } from '@/store'
import { codeApi, demoApi, noteApi } from '@/apis'
import { formatCss, formatHtml, formatJS } from '@/utils/code'
import { copyRes } from '@/utils/fun'

// 取点要用的数据
const $userStore = useUserStore()
const $codeStore = useCodeStore()
const $noteStore = useNoteStore()
const $route = useRoute()
const $router = useRouter()
const userMode = computed(() => $route.name === 'index')
const shareMode = computed(() => $route.name === 'share')

const isLogin = computed(() => $userStore.isLogin)

// 控制左侧2个面板展示
const showNoteList = ref(true)
const showNoteEditor = ref(true)

// 例子列表
const demoList = reactive<Demo[]>([])
const activeDemoId = ref('')
const activeDemo = computed(() => {
  const id = activeDemoId.value
  return demoList.find((v) => v.id === id)
})

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
      demoApi
        .createDemo(value)
        .then((res) => {
          demoList.push(res.data)
          activeDemoId.value = res.data.id
        })
        .catch(() => {
          ElMessage({
            type: 'error',
            message: '新增失败'
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      })
    })
}
const codeData = reactive({
  html: '',
  css: '',
  js: '',
  note: null as any
})

const handleSave = async (showSuccess = true) => {
  if (!isLogin.value || shareMode.value) {
    return
  }
  // 先进行格式化
  const cssResult = formatCss($codeStore.css)
  const jsResult = formatJS($codeStore.js)
  const htmlResult = formatHtml($codeStore.html)

  codeData.css = cssResult
  codeData.js = jsResult
  codeData.html = htmlResult
  await codeApi
    .updateDetail(activeDemo.value!.codeId, {
      css: cssResult,
      html: htmlResult,
      js: jsResult
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '保存代码失败'
      })
    })
  await noteApi
    .updateDetail(activeDemo.value!.noteId, $noteStore.note)
    .then(() => {
      if (showSuccess) {
        ElMessage({
          type: 'success',
          message: '保存成功'
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '保存笔记失败'
      })
    })
}
const handleChangeNote = async (v: Demo) => {
  await handleSave(false)
  activeDemoId.value = v.id
}
const tipText = computed(() => {
  if (userMode.value) {
    return isLogin.value ? '' : '请先登录 => '
  }
  if (shareMode.value) {
    return isLogin.value ? '将其保存到自己的笔记中 => ' : '登录后才可fork => '
  }
  return isLogin.value ? '' : '请先登录 => '
})

const showLoginDialog = ref(false)
const userForm = reactive({
  username: '',
  password: ''
})
const handleLogin = () => {
  if (
    !validateUsername(userForm.username) ||
    !validatePassword(userForm.password)
  ) {
    ElMessage.error('账号或密码格式不正确')
    return
  }
  $userStore
    .login(userForm.username, userForm.password)
    .then(() => {
      ElMessage({
        type: 'success',
        message: '登录成功'
      })
      showLoginDialog.value = false
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '登录失败'
      })
    })
}
const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      $userStore.logout().then(() => {
        ElMessage({
          type: 'success',
          message: '退出登录成功'
        })
        $codeStore.clear()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      })
    })
}

// 登录后触发
watchEffect(() => {
  if (isLogin.value && userMode.value) {
    demoApi.demoList().then((v) => {
      demoList.splice(0, demoList.length, ...v.data)
      // 获取最近的一个笔记
      // 从query或者localStorage中获取最近的一个笔记
      activeDemoId.value = localStorage.getItem('current-note') || v.data[0].id
    })
  }
})
watchEffect(() => {
  if (activeDemoId.value) {
    localStorage.setItem('current-note', activeDemoId.value)
  }
})
// 笔记切换的时候触发
watchEffect(() => {
  if (activeDemoId.value && userMode.value) {
    codeApi.codeDetail(activeDemo.value!.codeId).then((v) => {
      codeData.html = '<!-- 数据加载中 -->'
      codeData.css = '/* 数据加载中 */'
      codeData.js = '// 数据加载中'
      setTimeout(() => {
        codeData.html = v.data.html
        codeData.css = v.data.css
        codeData.js = v.data.js
      }, 200)
    })
    noteApi.getNodeDetail(activeDemo.value!.noteId).then((v) => {
      codeData.note = v.data.data
    })
  }
})

watchEffect(() => {
  if (shareMode.value && activeDemoId.value) {
    demoApi.getShareData(activeDemoId.value).then((v) => {
      const { share, code, note } = v.data
      if (!share) {
        ElMessage.error('已停止共享')
        return
      }
      codeData.html = '<!-- 数据加载中 -->'
      codeData.css = '/* 数据加载中 */'
      codeData.js = '// 数据加载中'
      codeData.note = note
      setTimeout(() => {
        codeData.html = code.html
        codeData.css = code.css
        codeData.js = code.js
      }, 200)
    })
  }
})
// 绑定保存快捷键
const handleKeyDownEvent = (e: KeyboardEvent) => {
  // ctrl + s || command + s
  if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    handleSave()
  }
}

// 分享相关逻辑
const showShareDialog = ref(false)
const shareLink = ref('')

const handleShare = () => {
  showShareDialog.value = true
  shareLink.value = `${window.location.protocol}//${window.location.hostname}${
    ['443', '80'].includes(window.location.port)
      ? ''
      : `:${window.location.port}`
  }/share/${activeDemoId.value}`
}
const handleChangeShare = () => {
  demoApi.shareDemo(activeDemo.value!.id, !activeDemo.value?.share).then(() => {
    activeDemo!.value!.share = !activeDemo.value?.share
  })
}
const handleCopyLink = () => {
  copyRes(shareLink.value, '链接已成功复制到剪贴板')
}

// fork相关逻辑
const handleFork = () => {
  demoApi.forkDemo(activeDemoId.value).then((v) => {
    localStorage.setItem('current-note', v.data.id)
    ElMessage.success('fork 成功')
    // 调接口
    // 回到自己的页面
    setTimeout(() => {
      window.location.replace('/')
    })
  })
}

const touchBar = ref<HTMLElement>()
const codeWidth = ref(Number(localStorage.getItem('codeWidth')) || 900)
onMounted(() => {
  if (shareMode.value) {
    activeDemoId.value = $route.params.id as string
  }
  $userStore.checkUserStatus().then((status) => {
    if (!status && userMode) {
      $noteStore.updateNote($noteStore.defaultNote)
    }
  })
  window.addEventListener('keydown', handleKeyDownEvent)

  touchBar.value?.addEventListener('mousedown', (e) => {
    const startPosX = e.pageX
    const startWidth = codeWidth.value
    // 解决iframe mousemove失效
    const mask = document.createElement('div')
    mask.style.position = 'fixed'
    mask.style.width = '100vw'
    mask.style.height = '100vh'
    mask.style.opacity = '0'
    mask.style.top = '0'
    document.body.append(mask)
    const handleMouseMove = (e: MouseEvent) => {
      codeWidth.value = startWidth - (startPosX - e.pageX)
      localStorage.setItem('codeWidth', `${codeWidth.value}`)
    }
    const handleMouseUp = () => {
      mask.remove()
      document?.removeEventListener('mousemove', handleMouseMove)
      document?.removeEventListener('mouseup', handleMouseUp)
    }
    document?.addEventListener('mousemove', handleMouseMove)
    document?.addEventListener('mouseup', handleMouseUp)
  })
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDownEvent)
})
</script>
<style scoped lang="scss">
@import './style.scss';
</style>
