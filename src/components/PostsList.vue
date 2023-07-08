<template>
  <ul class="posts-list" v-infinite-scroll="load">
    <li class="posts-box" v-for="post in listPosts" :key="post.id">
      <el-row :gutter="10">
        <el-col :md="4"></el-col>
        <el-col :md="16"></el-col>
        <el-col :md="4"></el-col>
      </el-row>
      <div class="left">
        <el-avatar :size="80" :src="getUser(post.user_id).avatar_url"></el-avatar>
        <div class="username">{{ getUser(post.user_id).username }}</div>
      </div>
      <div class="right">
        <div class="posts-title">{{ post.title }}</div>
        <p>{{ post.content }}</p>
        <div class>{{ post.publish_time }}</div>
      </div>
    </li>
  </ul>
</template>

<script>
import axios from "axios";
export default {
  name: "PostsList",
  props: [],
  data() {
    return {
      //帖子列表
      listPosts: [],
      //发布人信息
      publisher: [],
      count: 0
    };
  },
  created() {},
  mounted() {
    this.getListPosts();
    this.getListuserInfo();
  },
  methods: {
    load() {
      this.count += 2;
    },
    //
    getUser(user_id) {
      return (
        this.publisher.find(user => user.id === user_id) || {
          avatar_url: "/api/upload/avatar/1.png"
        }
      );
    },
    //获取全部帖子
    getListPosts() {
      axios.get("/api/admin/getPostList").then(res => {
        this.listPosts = res.data.data;
        console.log(this.listPosts);
      });
    },
    //获取发布人信息
    getListuserInfo() {
      axios
        .get("/api/admin/getUserList")
        .then(res => {
          this.publisher = res.data;
          console.log(res);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.posts-list {
  height: 100vh;
  padding: 0.625rem;
  box-sizing: border-box;
  overflow: auto;
  /* 设置滚动条的宽度和高度 */
}
.posts-box {
  background: #ffffff;
}
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
.posts-box {
  padding: 1rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
  display: flex;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.3);
  .right {
    margin-left: 1rem;
  }
}
.username {
  text-align: center;
  font-size: 20px;
}
.posts-title {
  font-size: 24px;
  font-weight: 700;
}
</style>