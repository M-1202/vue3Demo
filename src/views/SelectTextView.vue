<template>
  <div id="page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        文本选择系统
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(block, index) in textBlocks"
          :key="index"
          class="text-block bg-white rounded-lg shadow-lg p-6"
        >
          <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            {{ block.title }}
          </h2>
          <div class="text-content text-gray-600 leading-relaxed">
            {{ block.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const textBlocks = [
  {
    title: "Vue 3 Composition API",
    content:
      "Vue 3 引入了 Composition API，这是一种全新的逻辑组合和复用方式。它允许我们将组件的逻辑关注点分组，使代码更加模块化和可维护。",
  },
  {
    title: "TypeScript 应用",
    content:
      "TypeScript 为 JavaScript 添加了静态类型系统，大大提高了代码的可维护性和开发效率。它能在编译时捕获错误，提供更好的 IDE 支持。",
  },
  {
    title: "Tailwind CSS",
    content:
      "Tailwind CSS 是一个实用优先的 CSS 框架，它提供了大量的实用类，让我们可以直接在 HTML 中构建自定义设计。",
  },
  {
    title: "前端性能优化",
    content:
      "前端性能优化包括多个方面：代码分割和懒加载、图片优化、缓存策略、减少重绘和回流等。通过这些技术，我们可以显著提升用户体验。",
  },
];

onMounted(() => {
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("click", handleClick);
});

onUnmounted(() => {
  document.removeEventListener("mouseup", handleMouseUp);
  document.removeEventListener("mousedown", handleMouseDown);
  document.removeEventListener("click", handleClick);
});

function handleClick(e: MouseEvent) {
  // 点击标题或其他地方时确保移除弹框
  const target = e.target as HTMLElement;
  const isSelectionBubble = target.closest(".selection-bubble");
  const hasSelection = window.getSelection()?.toString().trim();

  // 如果点击的不是弹框，并且没有新的选择，则移除弹框
  if (!isSelectionBubble) {
    document.querySelectorAll(".selection-bubble").forEach((el) => el.remove());
  }
}

function handleMouseDown(e: MouseEvent) {
  // 如果点击的不是弹框，则移除弹框
  const target = e.target as HTMLElement;
  if (!target.closest(".selection-bubble")) {
    document.querySelectorAll(".selection-bubble").forEach((el) => el.remove());
    // 清除文本选择
    window.getSelection()?.removeAllRanges();
  }
}

function handleMouseUp(e: MouseEvent) {
  // 如果点击的是弹框，不处理
  const target = e.target as HTMLElement;
  if (target.closest(".selection-bubble")) {
    return;
  }

  setTimeout(() => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) return;

    const range = selection.getRangeAt(0);
    console.log("选中文本位置", range.startOffset, range.endOffset);

    const startBlock = (range.startContainer as Node).parentElement?.closest(
      ".text-block"
    );
    const endBlock = (range.endContainer as Node).parentElement?.closest(
      ".text-block"
    );

    // 移除已存在的弹框
    document.querySelectorAll(".selection-bubble").forEach((el) => el.remove());

    if (startBlock && endBlock && startBlock === endBlock) {
      // 在同一个文本块内
      createBubble(selection.toString().trim(), range.getBoundingClientRect());
    } else {
      // 跨文本块，清除选择
      selection.removeAllRanges();
      alert("只能在单个文本块内选择文本");
    }
  }, 50);
}

function createBubble(text: string, rect: DOMRect) {
  const bubble = document.createElement("div");
  bubble.className = "selection-bubble";
  bubble.innerHTML = `
    <div class="bubble-content">
      <div class="bubble-header">
        <span>已选择 ${text.length} 个字符</span>
      </div>
      <div class="bubble-actions">
        <button class="action-btn copy-btn">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          复制
        </button>
        <button class="action-btn">搜索</button>
        <button class="action-btn">分享</button>
      </div>
      <input type="text" class="bubble-input" placeholder="添加备注...">
    </div>
  `;

  // 设置位置
  bubble.style.top = `${rect.top + window.scrollY - 140}px`;
  bubble.style.left = `${rect.left + rect.width / 2 - 150}px`;

  // 点击复制按钮
  const copyBtn = bubble.querySelector(".copy-btn");
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
      // 显示成功提示
      const toast = document.createElement("div");
      toast.className = "success-toast";
      toast.textContent = "复制成功";
      document.body.appendChild(toast);

      setTimeout(() => toast.remove(), 2000);

      window.getSelection()?.removeAllRanges();
      bubble.remove();
    } catch (err) {
      console.error("复制失败:", err);
    }
  });

  document.body.appendChild(bubble);
}
</script>

<style scoped>
#page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.text-block {
  user-select: none;
}

.text-content {
  user-select: text;
}
</style>

<style>
.selection-bubble {
  position: absolute;
  z-index: 999;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
  width: 300px;
  animation: fadeIn 0.2s ease;
}

.bubble-content {
  padding: 16px;
}

.bubble-header {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.bubble-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.action-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.copy-btn {
  background: #6366f1;
  color: white;
}

.copy-btn:hover {
  background: #5558e3;
}

.bubble-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.bubble-input:focus {
  border-color: #6366f1;
}

.success-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

::selection {
  background-color: #60a5fa;
  color: white;
}
</style>
