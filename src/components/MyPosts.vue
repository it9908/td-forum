<template>
  <ul v-infinite-scroll="load" class="my-list-posts-box">
    <li v-for="(item, index) in myListPosts" :key="item.id" class="list">
      <el-row :gutter="10">
        <el-col :sm="6" :md="6" :lg="6" :xl="6">
          <el-image style="background-color: #000000;" :src="item.image_url" fit="fill"></el-image>
        </el-col>
        <el-col :sm="14" :md="14" :lg="14" :xl="14">
          <el-container>
            <el-header style="height:auto">{{item.title}}</el-header>
            <el-main>{{item.content}}</el-main>
            <el-footer style="height:auto">{{item.publish_time}}</el-footer>
          </el-container>
        </el-col>
        <el-col :sm="4" :md="4" :lg="4" :xl="4">
          <div class="btn-box">
            <el-button type="primary" @click.stop="postsEdit(item, index)">编辑</el-button>
            <el-button type="success" @click.stop="delPosts(item, index)">删除</el-button>
          </div>
        </el-col>
      </el-row>
    </li>
    <el-drawer
      title="详情信息"
      :visible.sync="drawer"
      :direction="'ttb'"
      :before-close="handleClose"
      :size="'100%'"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="currentPosts.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="currentPosts.content" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-image :src="currentPosts.image_url" lazy></el-image>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-input v-model="currentPosts.publish_time" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePostsById">修改</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </ul>
</template>

<script>
import axios from "axios";
export default {
  name: "MyPosts",
  data() {
    return {
      //需要编辑的帖子
      currentPosts: [],
      //我的帖子列表
      myListPosts: [],
      count: 0,
      drawer: false
    };
  },
  mounted() {
    this.getPostdById();
  },
  methods: {
    load() {
      this.count += 2;
    },
    //获取我的帖子信息
    getPostdById() {
      const token = localStorage.getItem("token");
      if (token === null || token === undefined || token === "") {
        alert("用户未登录");
        this.$router.replace({name:"Login"})
        return;
      }
      axios
        .get("/api/myposts", {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        .then(res => {
          this.myListPosts = res.data;
          console.log(res);
        });
    },
    //编辑
    postsEdit(params, index) {
      console.log(params, index);
      //获取当前点击编辑的帖子信息
      this.currentPosts = params;
      this.drawer = true;
    },
    // 修改
    updatePostsById() {
      axios
        .post(`api/updatePostsById/${this.currentPosts.id}`, {
          formData: this.currentPosts
        })
        .then(res => {
          console.log(res.data);
          if (res.data.code === 200) {
            this.drawer = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除
    delPosts(params, index) {
      console.log(params, index);
      axios
        .post("/api/del/myPosts", {
          data: {
            posts_id: params.id
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        .then(res => {
          console.log(res.data);
          this.getPostdById();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(res => {
          done();
          console.log(res);

        })
        .catch(err => {
          err;
        });
    }
  }
};
</script>

<style lang="less" scoped>
/* 设置滚动条的宽度和高度 */

::-webkit-scrollbar {
  width: 4px;
  height: 10px;
}
/* 设置滚动条轨道的背景颜色 */
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* 设置滚动条滑块的样式 */
::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 5px;
}
/* 设置鼠标悬停在滚动条上时的滑块样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
/deep/ .el-row {
  background: #ffffff;
}
.my-list-posts-box {
  height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  overflow: auto;
  .list {
    margin-bottom: 1rem;
    box-sizing: border-box;

    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.3);
  }
}
.btn-box {
  margin-top: 2rem;
}
/deep/ .el-form {
  padding: 2rem;
  box-sizing: border-box;
}
/deep/ .el-button + .el-button,
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
/deep/ .el-button--primary {
  margin-right: 10px;
}
</style>