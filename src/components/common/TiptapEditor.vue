<!-- components/TiptapEditor.vue -->
<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

const editor = new Editor({
  extensions: [
    StarterKit.configure({
      bulletList: { keepMarks: true },
      orderedList: { keepMarks: true },
    }),
    Underline,
  ],
  content: '<p>Hello <strong>Tiptap</strong>!</p>',
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<template>
  <div class="border rounded-lg shadow p-4 bg-white">
    <!-- 工具栏 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="[
          'px-3 py-1 rounded text-sm font-medium border',
          editor.isActive('bold') ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
        ]"
      >
        Bold
      </button>
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="[
          'px-3 py-1 rounded text-sm font-medium border',
          editor.isActive('underline') ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
        ]"
      >
        Underline
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="[
          'px-3 py-1 rounded text-sm font-medium border',
          editor.isActive('orderedList') ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
        ]"
      >
        OL
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="[
          'px-3 py-1 rounded text-sm font-medium border',
          editor.isActive('bulletList') ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
        ]"
      >
        UL
      </button>
    </div>

    <!-- 编辑器内容 -->
    <EditorContent :editor="editor" class="prose max-w-full min-h-[200px] focus:outline-none" />
  </div>
</template>

<style scoped>
/* 让 Tailwind 的 prose 更适合编辑状态 */
.prose :where(p):empty::before {
  content: attr(data-placeholder);
  color: #aaa;
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
