<script setup>
import { marked } from 'marked'
import { watch, onMounted, ref, nextTick } from 'vue'

const props = defineProps({
  content: String,
})

const htmlContent = ref('')
const contentDom = ref(null)

// 1. 自定义 `marked` 解析规则
marked.use({
  extensions: [
    // 禁用单个 `~` 解析成 <del>
    {
      name: 'no-single-tilde',
      level: 'inline',
      start (src) {
        return src.match(/~[^~]/)?.index // 查找单个 `~`
      },
      tokenizer (src) {
        const match = src.match(/^~([^~]+)~/)
        if (match) {
          return {
            type: 'text',
            raw: match[0],
            text: match[0], // 让 `~xxx~` 保持原样
          }
        }
        return undefined
      },
    },
    // 禁用 *xxx* 和 _xxx_ 解析成 <em>
    {
      name: 'disable-em',
      level: 'inline',
      start (src) {
        return src.match(/[*_]/)?.index
      },
      tokenizer (src) {
        const match = src.match(/^(\*|_)([^*_]+)\1/)
        if (match) {
          return {
            type: 'text',
            raw: match[0],
            text: match[0], // 保留原始 *xxx* 或 _xxx_
          }
        }
        return undefined
      },
    },
  ],
})

// 2. 确保渲染顺序  marked -> v-html -> MathJax
// 更新 Markdown 内容并渲染公式
const renderMarkdown = async () => {
  htmlContent.value =
    props.content === '-' ? '-' : marked.parse(props.content || '')
  await nextTick()
  if (window.MathJax) {
    try {
      await window.MathJax.typesetPromise([contentDom.value])
    } catch (err) {
      console.warn('MathJax 渲染失败:', err)
    }
  }
}

onMounted(renderMarkdown)
watch(() => props.content, renderMarkdown)
</script>

<template>
  <div
    class="w-full text-[var(--el-text-color-regular)] whitespace-pre-line preview-markdown"
    v-html="htmlContent"
    ref="contentDom"
  ></div>
</template>

<style lang="scss">
.preview-markdown {
  pre {
    white-space: pre-wrap; /* 允许换行 */
    word-wrap: break-word; /* 允许单词内换行 */
    max-width: 100%; /* 防止内容溢出 */
  }
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
}
</style>
