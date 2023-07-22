<template>
  <div class="post-detail">
    <div class="post-header">
      <h2 class="post-title">{{ post.title }}</h2>
      <div class="post-meta">
        <div class="author-avatar">
          <img :src="publisher.avatar_url" />
        </div>
        <div class="author-info">
          <p class="author-name">{{ post.username }}</p>
          <p class="post-date">{{ publisher.username }}</p>
        </div>
      </div>
    </div>
    <div class="post-content">{{ post.content }}</div>
    <el-divider></el-divider>
    <h3 class="comment-title">评论列表</h3>
    <div class="post-comments">
      <ul class="comment-list">
        <li v-for="c in comments" :key="c.id" class="comment-item">
          <div class="comment-meta">
            <div class="comment-avatar">
              <img :src="getUser(c.user_id).avatar_url" />
            </div>
            <div class="comment-info">
              <p class="comment-author">{{ c.username }}</p>
              <p class="comment-date">{{ getUser(c.user_id).username }}</p>
            </div>
          </div>
          <div class="comment-content">{{ c.content }}</div>
        </li>
      </ul>
    </div>
    <div class="comment-box">
      <el-input type="textarea" v-model="comment" placeholder="请输入评论内容"></el-input>
      <el-button type="primary" @click="submitComment">发表评论</el-button>
    </div>
  </div>
</template>

<script>
// import { get, post } from "@/axios/api";
export default {
  name: "PostDetail",
  data() {
    return {
      comment: "",
      post: [],
      postId: "",
      comments: [],
      publisher: [],
      publisher2: []
    };
  },
  created() {
    this.postId = this.$route.params.postId || localStorage.getItem("postId");
    console.log(this.postId);
  },
  mounted() {
    this.getPostsById();
    this.getComment();
    this.getListuserInfo();
  },
  methods: {
    // 发布评论
    submitComment() {
  //     if (this.comment === "") {
  //       this.$message({
  //         showClose: true,
  //         message: "不能发布空消息",
  //         type: "warning"
  //       });
  //       return;
  //     }
  //     const arr = {
  //       postId: this.postId,
  //       content: this.comment
  //     };
  //     const token = localStorage.getItem("token");
  //     post("/api/postComment", arr, token).then(res => {
  //       console.log(res);
  //       this.comment = "";
  //       this.getComment();
  //     });
    },
  //   getUser(user_id) {
  //     return (
  //       this.publisher2.find(user => user.id === user_id) || {
  //         avatar_url: "/api/upload/avatar/1.png"
  //       }
  //     );
  //   },
  //   //获取发布人信息
  //   getListuserInfo() {
  //     get("/api/admin/getUserList").then(res => {
  //       console.log(res);
  //       this.publisher2 = res;
  //     });
  //   },
  //   // 获取列表
  //   getPostsById() {
  //     get(`/api/admin/getPostsById/${this.postId}`)
  //       .then(res => {
  //         this.post = res.data[0];
  //         console.log(this.post);
  //       })
  //       .then(() => {
  //         get(`/api/admin/getUserInfoById/${this.post.user_id}`).then(res => {
  //           console.log(res.data);
  //           this.publisher = res.data[0];
  //         });
  //       });
  //   },
  //   // 获取评论
  //   getComment() {
  //     get(`/api/getComment/${this.postId}`).then(res => {
  //       console.log(res);
  //       this.comments = res.data;
  //     });
  //   }
  }
};
</script>

<style scoped>
div{
  color: #ffffff;
}
.post-comments {
  overflow: auto;
  height: 60%;
}
.post-detail {
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
}

.post-header {
  text-align: center;
  margin-bottom: 20px;
}

.post-title {
  font-size: 24px;
  font-weight: bold;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.author-avatar,
.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.author-avatar img,
.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info,
.comment-info {
  display: flex;
  flex-direction: column;
}

.author-name,
.comment-author {
  font-weight: bold;
  margin: 0;
}

.post-date,
.comment-date {
  color: #ffffff;
  margin: 0;
}

.post-content {
  line-height: 1.6;
  margin-bottom: 40px;
}

.comment-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comment-item {
  margin-bottom: 20px;
}

.comment-meta {
  display: flex;
  align-items: center;
}

.comment-content {
  margin-left: 50px;
}
.comment-box{
  display: flex;
}
/* Webkit 内核浏览器（Chrome、Safari） */
::-webkit-scrollbar {
  width: 2px; /* 滚动条宽度 */
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 滚动条背景色 */
}

::-webkit-scrollbar-thumb {
  background-color: #888; /* 滚动条滑块颜色 */
  border-radius: 4px; /* 滚动条滑块圆角 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 鼠标悬停时滚动条滑块颜色 */
}

</style>