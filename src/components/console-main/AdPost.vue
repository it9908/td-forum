<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="封面">
      <div class="image-b" v-if="isImg">
        <el-image
          style="width: 300px;"
          :src="`http://localhost:5000/image/${form.cover}`"
          fit
          :preview-src-list="fileList"
        ></el-image>
        <!-- 移除图片提示 -->
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
          v-for="tag in form.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          effect="dark"
        >{{tag}}</el-tag>

        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model.trim="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </div>
    </el-form-item>
    <el-form-item label="内容">
      <mavon-editor ref="md" v-model="form.content" :ishljs="true" @imgAdd="imgAdd" />
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="success">提交审核</el-button>
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
  .input-new-tag {
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
</style>

<script>
// import {mavonEditor} from 'mavon-editor'
import axios from "axios";
import { release } from "@/api/user";
export default {
  data() {
    return {
      file: null, // 存储文件对象,
      form: {
        title: "",
        cover: "",
        tags: ["标签一", "标签二", "标签三"],
        content: ""
      },
      isImg: false,
      fileList: [],

      inputVisible: false,
      inputValue: ""
    };
  },
  mounted() {
  },
  methods: {
    // 绑定@imgAdd event
    imgAdd(pos, file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("file", file);
      axios({
        url: "http://localhost:5000/v1/upload/image",
        method: "POST",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(res => {
        // 接受服务器传回重命名的图片
        const imgname = res.data.filename
        const url = `http://localhost:5000/image/${imgname}`
        this.$refs['md'].$img2Url(pos, url);
      });
    },

    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (!inputValue) {
        this.inputVisible = false;
        return;
      }
      if (!this.form.tags.includes(inputValue)) {
        // 如果用户输入的标签不为空，并且当前标签列表中不存在该标签，才添加
        this.form.tags.push(inputValue);
        this.inputValue = "";
        return;
      }

      this.inputVisible = false;
      this.inputValue = "";
    },
    // 上传成功时
    handleUploadSuccess(response, file, fileList) {
      // 处理上传成功的逻辑，例如添加文件到
      const imgName = fileList[0].response.filename;
      this.form.cover = imgName;
      this.isImg = true;
    },

    // 移除封面
    removeCover() {
      this.fileList = [];
      this.isImg = false;
    },
    async success() {
      console.log(this.form);
      const res = await release(this.form);
      console.log(res);
    }
  }
};
</script>