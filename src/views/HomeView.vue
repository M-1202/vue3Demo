<template>
  <div @mouseup="handleMouseUp" @mousedown="handleMouseDown">
    <div class="block">
      <p>区域1</p>
      <p>
        这是一些可供选择的文本内容。当你用鼠标选中这些文字时，会出现一个弹窗显示你选中的内容。
      </p>
    </div>
    <div class="block">
      <p>区域1</p>
      <p>
        这是一些可供选择的文本内容。当你用鼠标选中这些文字时，会出现一个弹窗显示你选中的内容。
      </p>
    </div>

    <!-- <div
      v-if="visible"
      ref="popupRef"
      :style="{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        background: '#fff',
        border: '1px solid #ccc',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
      }"
    >
      选中的内容：{{ selectedText }}
      <el-button @click="handlePopupClick">弹窗按钮</el-button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const popupRef = ref(null);
const selectedText = ref("");
const visible = ref(false);
const position = ref({ x: 0, y: 0 });

// 创建弹窗函数
const createElement = (text, rect) => {
  const el = document.createElement("div");
  el.className = "popup";
  el.innerHTML = `
    <div>选中的内容 ${text}</div>
    <el-button @click="handlePopupClick">弹窗按钮</el-button>`;
  el.style.position = "absolute";
  el.style.zIndex = 1000;
  el.style.top = `${rect.top + window.scrollY - 50}px`;
  el.style.left = `${rect.left + rect.width / 2 - 40}px`;
  document.body.appendChild(el);
};

const handleMouseUp = (event) => {
  // 点击弹窗不处理
  console.log("12", event.target.closest(".popup"));

  if (event.target.closest(".popup")) {
    return;
  }

  const selection = window.getSelection();
  const text = selection.toString().trim();
  console.log("选中", selection);

  if (text) {
    // 移除已存在的弹框
    document.querySelectorAll(".popup").forEach((el) => el.remove());
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // selectedText.value = text;
    // position.value = {
    //   x: rect.left + window.scrollX,
    //   y: rect.top + window.scrollY - 50, // 上移一点
    // };
    createElement(text, rect);
    visible.value = true;
  } else {
    visible.value = false;
  }
};

// 点击弹窗按钮测试用
const handlePopupClick = () => {
  alert("弹窗按钮被点击");
};

const handleMouseDown = (event) => {
  // 点击任何地方开始前隐藏浮窗
  visible.value = false;
};

const handleClickOutside = (event) => {
  const selection = window.getSelection();
  const isEmpty = selection.toString().trim() === "";

  // 如果点击的是弹窗内部，就不隐藏
  console.log("点击", popupRef.value, event.target);

  if (popupRef.value && popupRef.value.contains(event.target)) {
    return;
  }

  if (isEmpty) {
    visible.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);
  // document.addEventListener("click", handleClick);
});

onUnmounted(() => {
  document.removeEventListener("mouseup", handleMouseUp);
  document.removeEventListener("mousedown", handleMouseDown);
  // document.removeEventListener("click", handleClick);
});
</script>

<style scoped>
p {
  line-height: 1.6;
  user-select: text;
}
</style>
