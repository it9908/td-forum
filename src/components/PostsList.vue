<template>
  <div class="waterfall-container">
    <el-row :gutter="10">
      <el-col v-for="(p, index) in listPosts" :key="index" :span="6">
        <div class="post-item" @click="goToPostDetail(p.id)">
          <div class="avatar-nickname">
            <div class="avatar">
              <img :src="getUser(p.user_id).avatar_url" alt="User Avatar" />
            </div>
            <div class="nickname">{{ getUser(p.user_id).username }}</div>
          </div>
          <div class="post-title">{{ p.title }}</div>
          <div class="publish-time">{{ p.publish_time }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { get } from "@/axios/api";

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

  mounted() {
    this.getListPosts();
    this.getListuserInfo();
  },
  methods: {
    goToPostDetail(postId) {
      // 使用路由导航进行页面跳转，将点击的帖子ID传递给详情页组件
      localStorage.setItem("postId", postId);
      this.$router.push({ name: "PostDetail", params: { postId } });
    },
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
      get("/api/admin/getPostList").then(res => {
        console.log(res);
        this.listPosts = res.data;
      });
    },
    //获取发布人信息
    getListuserInfo() {
      get("/api/admin/getUserList").then(res => {
        console.log(res);
        this.publisher = res;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.waterfall-container {
  height: 100vh;
  padding: 0.625rem;
  box-sizing: border-box;
  overflow: auto;
}

.waterfall-item {
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;
}

.waterfall-item:hover {
  transform: translateY(-5px);
}

.post-item {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
}

.post-item:hover {
  transform: translateY(-5px);
}

.avatar-nickname {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nickname {
  font-weight: bold;
  font-size: 16px;
}

.post-title {
  font-size: 14px;
  margin-bottom: 5px;
}

.publish-time {
  font-size: 12px;
  color: #888888;
}
</style>