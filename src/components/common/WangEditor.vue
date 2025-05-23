<template>
    <div style="border: 1px solid #EEEFF0; border-radius: 5px; overflow: hidden; width: 100%;">
        <Toolbar style="border-bottom: 1px solid #EEEFF0" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
import { ref, shallowRef, onBeforeUnmount, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 引入样式
import '@wangeditor/editor/dist/css/style.css'

// 定义属性
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

// 定义事件
const emit = defineEmits(['update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内部值
const valueHtml = ref(props.modelValue)

// 监听外部传入的值变化
watch(() => props.modelValue, (newValue) => {
    valueHtml.value = newValue
})

// 编辑器模式
const mode = 'default' // 或 'simple' 简洁模式

// 工具栏配置
const toolbarConfig = {
    // 可以自定义工具栏按钮
    toolbarKeys: [
        'headerSelect',
        'bold',
        'italic',
        'underline',
        'through',
        'bulletedList',
        'numberedList',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'insertLink',
        // 'uploadImage',
        'undo',
        'redo'
    ]
}

// 编辑器配置
const editorConfig = {
    placeholder: '请输入内容...',
    // 可以在这里配置图片上传
    MENU_CONF: {
        uploadImage: {
            // 自定义图片上传
            customUpload(file, insertFn) {
                // 这里可以实现自定义上传逻辑
                // 示例：模拟上传成功，插入图片
                const url = URL.createObjectURL(file)
                insertFn(url)

                // 需要将图片上传到服务器
                // 例如：
                // const formData = new FormData()
                // formData.append('file', file)
                // fetch('/api/upload', { method: 'POST', body: formData })
                //   .then(res => res.json())
                //   .then(res => {
                //     insertFn(res.url)
                //   })
            }
        }
    }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

// 编辑器创建完成时的回调
const handleCreated = (editor) => {
    editorRef.value = editor
}

// 编辑器内容变化时的回调
const handleChange = (editor) => {
    // 判断编辑器是否为空，避免初始化时的 <p><br/></p> 导致表单验证失败
    emit('update:modelValue', editor.isEmpty() ? '' : editor.getHtml())
}
</script>
