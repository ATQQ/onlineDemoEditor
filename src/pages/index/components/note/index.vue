<template>
    <div id="note-editor"></div>
</template>
<script setup>
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

import { onMounted } from 'vue'

onMounted(() => {
    const editor = new EditorJS({
        holder: 'note-editor',
        placeholder: '在这里开始记录你的笔记',
        /**
         onReady callback
        */
        onReady: () => {
            console.log('Editor.js is ready to work!')
        },
        /**
        * onChange callback
        */
        onChange: (api, e) => {
            editor.save().then((outputData) => {
                console.log('Article data: ', outputData)
            }).catch((error) => {
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
        },
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