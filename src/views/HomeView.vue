<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref } from 'vue'
import { Quill } from '@vueup/vue-quill'
import QuillHeader from 'quill/formats/header'
import QuillList from 'quill/formats/list'

Quill.register({
  'formats/header': QuillHeader,
  'formats/list': QuillList
})

const content = ref('<p>Hello Quill!</p>')
// 工具栏配置
const modules = {
  toolbar: {
    container: [
      ['bold', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  }
}

const dialogVisible = ref(false)
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
    <el-button @click="dialogVisible = true">预览</el-button>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
  >
    <!-- <Markdown :content="content" /> -->
    <div v-html="content"></div>
  </el-dialog>
  {{ content }}
</template>

<style lang="scss">
// 有序列表样式
  ol,
  ul {
    list-style-type: decimal; // 显示数字序号
    padding-left: 1.5em; // 适当的缩进
    white-space: normal;
    li {
      white-space: pre-line;
    }
  }
  strong,
  b {
  font-weight: bold;
  }
</style>
