<script setup>
import { ref } from 'vue'
// import TiptapEditor from "@/components/common/TiptapEditor.vue"
// import { Editor, EditorContent } from '@tiptap/vue3'
// import StarterKit from '@tiptap/starter-kit'
import WangEditor from '@/components/common/WangEditor.vue'

// const editor = new Editor({
//   content: '<p>Hello World!</p>',
//   extensions: [
//     StarterKit,
//   ],
// })

const content = ref('')
const dialogVisible = ref(false)
</script>

<template>
  <div class="p-6">
    <WangEditor v-model="content" />
    <el-button @click="dialogVisible = true">预览</el-button>
    <el-dialog v-model="dialogVisible" title="Tips" width="500">
      <div v-html="content"></div>
    </el-dialog>
    {{ content }}
  </div>
</template>