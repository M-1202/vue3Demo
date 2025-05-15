<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref } from 'vue'
import Quill from 'quill'

const content = ref('<p>Hello Quill!</p>')

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ header: [1, 2, 3, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['clean']
]

// modules 配置为符合 Quill 模块规范的数组形式
const modules = [
  {
    module: Quill.import('modules/toolbar'),
    options: toolbarOptions
  }
]
</script>

<template>
  <div>
    <QuillEditor
      v-model:content="content"
      content-type="html"
      :modules="modules"
      theme="snow"
      style="height: 300px"
    />
  </div>
</template>
