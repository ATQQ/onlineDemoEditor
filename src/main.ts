import { createApp } from 'vue'
import { createPinia } from 'pinia'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CSSWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HTMLWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import router from './router'
import App from './App.vue'
import Axios from './apis/ajax'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
    getWorker(_:any, label:string) {
      if (label === 'json') {
        return new JSONWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new CSSWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new HTMLWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new TSWorker()
      }
      return new EditorWorker()
    },
  }
document.title = import.meta.env.VITE_APP_TITLE

const app = createApp(App)
app.use(createPinia())
app.provide('$http', Axios)
app.use(router)

app.mount('#app')
