<template>
  <div class="container">
    <el-row>
      <el-row :gutter="10">
        <el-col :md="4" :lg="4" :xl="3">
          <div class="grid-content bg-purple-light">
            <el-page-header @back="goBack" content="详情页面"></el-page-header>
            <router-link to="/forum">全部帖子</router-link>
          </div>
        </el-col>
        <el-col :md="16" :lg="16" :xl="18">
          <div class="grid-content-center bg-purple">
            <router-view ref="routerView"></router-view>
          </div>
        </el-col>
        <el-col :md="4" :lg="4" :xl="3">
          <div class="grid-content grid-content-right">
            <el-avatar :size="60" :src="userInfo.avatar"></el-avatar>
            <span>{{ userInfo.username }}</span>
            <el-row class="s-box" :gutter="10">
              <el-col :span="12">
                <div class="grid-content-s">
                  <i class="el-icon-chat-line-square"></i>
                  <el-link type="primary" @click="goMyPosts">主要链接</el-link>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content-s">
                  <i class="el-icon-chat-line-square"></i>
                  <router-link to="/forum/mycomment">我的评论</router-link>
                </div>
              </el-col>
            </el-row>
            <el-menu class="el-menu-vertical-demo" active-text-color="#ffd04b">
              <el-menu-item>
                <template slot="title">
                  <i class="el-icon-edit"></i>
                  <span @click.stop="drawer = true">发布帖子</span>
                </template>
              </el-menu-item>
              <el-menu-item>
                <template slot="title">
                  <i class="el-icon-switch-button"></i>
                  <el-button type="text" @click="open">退出登录</el-button>
                </template>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
      </el-row>
    </el-row>

    <el-drawer
      :size="'80%'"
      title="发布"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <el-form ref="form" label-width="80px" style="padding: 1.25rem;box-sizing: border-box;">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            name="image"
            :limit="1"
            action="http://localhost:5000/upload/image"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="release">发布</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { decodeToken } from "@/utils/check";
import axios from "axios";
export default {
  name: "MyForum", 
  data() {
    return {
      form: {
        title: "",
        content: ""
      },
      fileList: [],
      //当前用户信息
      userInfo: [],
      drawer: false,
      direction: "ttb"
    };
  },
  mounted() {
    this.getCurrUserInfo();
  },
  computed: {},
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(res => {
          console.log(res);
          done();
          this.form.title = "";
          this.form.content = "";
          this.fileList = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 是否退出登录
    open() {
      this.$confirm("确定退出吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.logout();
          this.$message({
            type: "success",
            message: "退出成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    },
    // 退出登录
    logout() {
      localStorage.removeItem("token");
      this.$router.replace({ name: "Home" });
    },
    // 上传成功时
    handleUploadSuccess(response, file, fileList) {
      // 处理上传成功的逻辑，例如添加文件到 fileList
      this.fileList = fileList;
    },
    // 发布
    release() {
      const formData = new FormData();
      formData.append("title", this.form.title);
      formData.append("content", this.form.content);
      formData.append("image", this.fileList[0].raw);
      axios
        .post("/api/upload/posts/create", formData, {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          // 处理成功响应
          console.log(response.data);
          this.$message("发布成功");
          this.drawer = false;
          this.form.title = "";
          this.form.content = "";
          this.fileList = [];
          const routerView = this.$refs.routerView;
          const routerName = this.$route.name;
          if (routerName === "MyPosts") {
            routerView.getPostdById();
          } else if (routerName === "PostsList") {
            routerView.getListPosts();
          }
        })
        .catch(error => {
          // 处理错误响应
          console.error(error);
        });
    },
    // 返回首页
    goBack() {
      console.log("go back");
    },
    // 获取用户信息
    getCurrUserInfo() {
      const token = localStorage.getItem("token");
      if (token === null || token === undefined || token === "") {
        //当未登录时
        const unlisted = {
          username: "未登录",
          avatar: "http://localhost:5000/upload/avatar/3.png"
        };
        this.userInfo = { ...unlisted };
        return;
      }
      // 登录后
      this.userInfo = decodeToken(token);
    },
    //
    goMyPosts() {
      this.$router.push({ name: "MyPosts" });
    }
  }
};
</script>

<style lang="less" scoped>
.grid-content-center {
  height: 100vh;
  background: rgba(255, 255, 255, 0.5);
}
.grid-content-s {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container {
  padding: 0.625rem;
  box-sizing: border-box;
  background: url("../assets/bg-2.jpg") no-repeat;
  background-size: cover;
}
.grid-content-right {
  padding: 0.625rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.grid-content {
  background: rgba(255, 255, 255, 0.5);
}
.el-menu-vertical-demo {
  width: 100%;
}
</style>