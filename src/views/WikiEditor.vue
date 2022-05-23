<template>
  <div id="body-box">
    <el-row justify="end" type="flex">
      <el-button type="primary" @click="savePage">保存</el-button>
    </el-row>
    <Toolbar
        style="border-bottom: 1px solid #e8e8e8"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    >
    </Toolbar>
    <div id="content-box">
      <div id="editor-box">
        <div id="title-box">
          <input placeholder="请输入标题" v-model="title">
        </div>
        <Editor
            id="main-editor"
            style=" min-height: 900px; margin-top: 20px;"
            :defaultConfig="editorConfig"
            v-model="content"
            @onChange="onChange"
            @onCreated="onCreated"
            :mode="mode"
        />
      </div>
    </div>
  </div>

</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {Boot} from '@wangeditor/editor'
import attachmentModule from '@wangeditor/plugin-upload-attachment'
import {getRequest, postRequest} from "@/util/api";


attachmentModule.elemsToHtml = [
  {
    type: 'attachment', // 节点 type ，重要！！！
    elemToHtml: function (elem) {
      const {link = '', fileName = ''} = elem;
      return `<a data-w-e-type="attachment"
                data-w-e-is-void
                data-w-e-is-inline
                data-link="${link}"
                data-fileName="${fileName}"
                href="${link}"
                target="_blank">${fileName}
              </a>`;
    },
  }
]

// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(attachmentModule)

export default {
  name: "WikiEditor",
  props: [],
  components: {Editor, Toolbar},
  data() {
    return {
      mode: 'default', // or 'simple'
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        excludeKeys: ['fullScreen', "video"],
        insertKeys: {
          index: -1, // 自定义插入的位置
          keys: ['uploadAttachment'], // “上传附件”菜单
        },
      },
      editorConfig: {
        placeholder: '请输入内容...',
        autoFocus: true,
        scroll: false, // 禁止编辑器滚动
        hoverbarKeys: {
          attachment: {
            menuKeys: ['downloadAttachment'], // “下载附件”菜单
          },
        },
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          uploadImage: {
            withCredentials: true,
            server: "/images",
            fieldName: 'image',
            base64LimitSize: 0
          },
          // “上传附件”菜单的配置
          uploadAttachment: {
            server: '/files', // 服务端地址
            timeout: 25 * 1000,
            fieldName: 'file',
            maxFileSize: 100 * 1024 * 1024, // 100M
            onBeforeUpload(file) {
              console.log('onBeforeUpload', file)
              return file // 上传 file 文件
              // return false // 会阻止上传
            },
            onProgress(progress) {
              console.log('onProgress', progress)
            },
            onSuccess(file, res) {
              console.log('onSuccess', file, res)
            },
            onFailed(file, res) {
              alert(res.message)
              console.log('onFailed', file, res)
            },
            onError(file, err, res) {
              alert(err.message)
              console.error('onError', file, err, res)
            },
            // 插入到编辑器后的回调
            onInsertedAttachment(elem) {
              console.log('inserted attachment', elem)
            },
          }
        },
      },
      editor: null,
      title: '',
      content: '',
      data: '',
    }

  },
  computed: {},
  watch: {},
  methods: {
    savePage() {
      let p = {
        title: this.title,
        content: this.content
      }
      postRequest('/pages', p)
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          });
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
    },
    onChange(editor) {
      this.data = JSON.stringify(editor.children)
      this.content = editor.getHtml()
    },
    focusEditor(e) {
      if (e.target.id === 'main-editor') {
        this.editor.blur()
        this.editor.focus(true) // focus 到末尾
      }
    }
  },

  //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
  mounted() {
    document.getElementById('main-editor').addEventListener('click', this.focusEditor);

    let id = this.$route.params.id
    getRequest('/pages/' + id)
        .then(res => {
          this.title = res.title;
          this.content = res.content;
        })
        .catch(err => {
          console.log(err)
        });

  },
  beforeDestroy() {
    document.getElementById('main-editor').removeEventListener('click', this.focusEditor);
    if (this.editor != null) {
      this.editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
    }
  },

}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang='less' scoped>
#body-box {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  color: #333;


  #content-box {
    height: calc(100% - 40px);
    background-color: rgb(245, 245, 245);
    overflow-y: auto;
    position: relative;


    #title-box {
      padding: 20px 0;
      border-bottom: 1px solid #e8e8e8;

      input {
        font-size: 30px;
        border: 0;
        outline: none;
        width: 100%;
        line-height: 1;
      }
    }

    #editor-box {
      width: 850px;
      margin: 30px auto 150px auto;
      background-color: #fff;
      padding: 20px 50px 50px 50px;
      border: 1px solid #e8e8e8;
      box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
    }

  }
}


</style>
