<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="标题">
      <el-input></el-input>
    </el-form-item>
    <el-form-item label="封面">
      <div class="image-b" v-if="isImg">
        <el-image style="width: 300px;" :src="fileList[0]" fit :preview-src-list="fileList"></el-image>
        <el-popconfirm title="确定删除吗？" @confirm="removeCover">
          <el-button type="danger" slot="reference" size="mini" icon="el-icon-delete" circle></el-button>
        </el-popconfirm>
      </div>
      <el-upload
        v-if="!isImg"
        class="upload-demo"
        name="file"
        drag
        action="http://localhost:5000/v1/upload/image"
        multiple
        :limit="1"
        :on-success="handleUploadSuccess"
        :file-list="fileList"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item label="标签">
      <div class="tag-list">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>

        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </div>
    </el-form-item>
    <el-form-item label="内容">
      <div style="border: 1px solid #ccc;">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 300px; overflow-y: hidden;"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
        />
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="success">发布</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="less" scoped>
.el-tag {
  margin: 0 2px;
}
.tag-list {
  padding: 5px;
  background: #ffffff;
  border: 1px dashed #e15f41;
  box-sizing: border-box;
  .input-new-tag{
    width: 100px;
  }
}
.image-b {
  width: 300px;
  padding: 10px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px dashed #ccc;
  position: relative;
  .el-button {
    position: absolute;
    right: -15px;
    top: -15px;
  }
}

.el-form .el-form-item /deep/.el-form-item__content {
  line-height: 0px;
}

@import "@wangeditor/editor/dist/css/style.css";
</style>

<script>
import Vue from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default Vue.extend({
  components: { Editor, Toolbar },
  data() {
    return {
      isImg: false,
      fileList: [],
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple'
      dynamicTags: ["React", "Js", "Vue"],
      inputVisible: false,
      inputValue: ""
    };
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = "<p>模拟 Ajax 异步设置内容 HTML</p>";
    }, 1500);
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    // 上传成功时
    handleUploadSuccess(response, file, fileList) {
      // 处理上传成功的逻辑，例如添加文件到 fileList
      this.fileList.push(`http://localhost:5000/image/${fileList[0].name}`);
      this.isImg = true;
      console.log(response, fileList, this.fileList);
    },

    // 移除封面
    removeCover() {
      this.fileList = [];
      this.isImg = false;
    }
  }
});
</script>