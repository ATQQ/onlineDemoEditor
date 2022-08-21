import { defineStore } from 'pinia'

const useStore = defineStore('code', {
  state: () => ({
    html: '<h1>Hello World</h1>',
    css: `h1 {
  color: red;
}`,
    js: 'console.log("Hello World")'
  }),
  actions: {
    updateCss(payload: string) {
      this.css = payload
    },
    updateHtml(html: string) {
      this.html = html
    },
    updateJs(js: string) {
      this.js = js
    },
    clear() {
      this.html = '<h1>Hello World</h1>'
      this.css = `h1 {
  color: red;
}`
      this.js = 'console.log("Hello World")'
    }
  }
})

export default useStore
