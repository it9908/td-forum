<template>
  <div class="container">
    <el-row>
      <el-col :md="4" :lg="4" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-page-header @back="goBack" title="首页" content="论坛中心"></el-page-header>
          <el-divider></el-divider>
          <el-menu router :default-active="$route.path">
            <el-menu-item index="/forum">
              <i class="el-icon-setting"></i>
              <span slot="title">全部帖子</span>
            </el-menu-item>
          </el-menu>
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
            <el-col :span="24">
              <div>
                <i class="el-icon-chat-line-square"></i>
                <el-link type="info" @click="goMyPosts">我的帖子</el-link>
              </div>
            </el-col>
          </el-row>
          <el-menu class="el-menu-vertical-demo" active-text-color="#ffd04b">
            <el-menu-item>
              <template slot="title">
                <i class="el-icon-edit"></i>
                <span @click.stop="isDrawer">发布帖子</span>
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
            name="file"
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
          <el-button @click="releasePosts">发布</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { infoUser, release } from "@/api/user";
// import axios from "axios";
export default {
  name: "MyForum",
  data() {
    return {
      form: {
        title: "",
        content: "",
        image:""
      },
      fileList: [],
      //当前用户信息
      userInfo: [],
      drawer: false,
      direction: "ttb"
    };
  },
  created() {},
  async mounted() {
    // this.getCurrUserInfo();
    const res = await infoUser();
    // 获取用户信息
    this.userInfo = res.data.data;
    console.log(this.userInfo);
  },
  methods: {
    isDrawer() {
      const token = localStorage.getItem("token");
      if (token === null || token === undefined || token === "") {
        this.$message({
          message: "您还未登录",
          type: "warning",
          offset: 100
        });
        return;
      }
      this.drawer = true;
    },
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
      this.form.image = fileList[0].name;
      console.log(fileList);
    },
    // 发布
    async releasePosts() {
      if (!this.form.title || !this.form.content || !this.fileList) {
        console.log("请补充完成");       
            } else {
        // const formData = {
        //   title: this.form.title,
        //   content: this.form.content,
        //   image: this.fileList[0].raw
        // };
        const res = await release(this.form);
        this.$message({
          message: res.data.message,
          type: "success"
        });
        // 关闭抽屉
        this.drawer = false;
      }
    },
    // 返回首页
    goBack() {
      console.log("go back");
      this.$router.push({ name: "Home" });
    },
    // 获取用户信息
    // getCurrUserInfo() {
    //   const token = localStorage.getItem("token");
    //   if (token === null || token === undefined || token === "") {
    //     //当未登录时
    //     const unlisted = {
    //       username: "未登录",
    //       avatar: "http://localhost:5000/upload/avatar/3.png"
    //     };
    //     this.userInfo = { ...unlisted };
    //     return;
    //   }
    //   // 登录后
    //   // this.userInfo = decodeToken(token);
    // },
    //
    goMyPosts() {
      this.$router.push({ name: "MyPosts" });
    },
    goComment() {
      this.$router.push({ name: "MyComment" });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
  background: url("../assets/bg-2.jpg");
  background-size: cover;
}
.bg-purple-light {
  background: #ffffff;
  box-shadow: 0px 12px 18px rgba(0, 0, 0, 0.5);
  // height: 100vh;
}
.grid-content-center {
  background: rgba(0, 0, 0, 0.5);
}

.grid-content-right {
  padding: 0.625rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #ffffff;
}

.el-menu-vertical-demo {
  width: 100%;
}
</style>