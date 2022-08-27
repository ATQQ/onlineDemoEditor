<template>
  <div class="render" ref="webContainer"></div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useCodeStore } from '@/store'

const renderType = 'iframe'
const $codeStore = useCodeStore()
const webContainer = ref<any>(null)
const $iframe = ref(document.createElement('iframe'))
const shadowPage = ref(document.createElement('div'))
shadowPage.value.style.cssText = `
    width: 100%;
    height: 100%;
    background-color: #fff;
    transition: opacity .3s;
`
const $baseStyle = ref(document.createElement('style'))
$baseStyle.value.textContent = '*{margin:0;padding:0;}'

const $style = ref(document.createElement('style'))
const $html = ref(document.createElement('div'))
const $script = ref(document.createElement('script'))
shadowPage.value.attachShadow({ mode: 'open' })
shadowPage.value.shadowRoot?.append(
  $baseStyle.value,
  $style.value,
  $html.value,
  $script.value
)

watchEffect(() => {
  if (webContainer.value && webContainer.value.children.length === 0) {
    // webContainer.value.appendChild(shadowPage.value)
    webContainer.value.appendChild($iframe.value)
  }
})

// web components
watchEffect(() => {
  if ($codeStore.html !== undefined) {
    $html.value.innerHTML = $codeStore.html
  }
})
watchEffect(() => {
  if ($codeStore.css !== undefined) {
    $style.value.innerHTML = $codeStore.css
  }
})
watchEffect(() => {
  if ($codeStore.js !== undefined) {
    $script.value.remove()
    $script.value = document.createElement('script')
    $script.value.textContent = $codeStore.js

    if (renderType === 'iframe') {
      const tem = document.createElement('iframe')
      tem.addEventListener('load', () => {
        // console.clear()
        // TODO:使用调试工具替代
        tem.contentDocument?.head.append($baseStyle.value, $style.value)
        tem.contentDocument?.body.append($html.value, $script.value)
        $iframe.value.remove()
        $iframe.value = tem
      })
      webContainer?.value?.appendChild(tem)
      return
    }
    shadowPage.value.shadowRoot?.appendChild($script.value)
  }
})
</script>
<style scoped lang="scss">
.render {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
<style>
iframe {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: none;
}
</style>
