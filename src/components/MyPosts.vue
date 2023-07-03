<template>
  <ul v-infinite-scroll="load" class="my-list-posts-box">
    <li v-for="(item, index) in myListPosts" :key="item.id" class="list">
      <el-row :gutter="10">
        <el-col :md="6" :lg="6" :xl="6">
          <el-image style="background-color: #000000;" :src="item.image_url" fit="fill"></el-image>
        </el-col>
        <el-col :md="14" :lg="14" :xl="14">
          <div>
            <div>
              <h2>{{item.title}}</h2>
            </div>
            <div>{{item.content}}</div>
          </div>
        </el-col>
        <el-col :md="4" :lg="4" :xl="4">
          <div class="btn-box">
            <el-button type="primary" @click.stop="postsEdit(item, index)">编辑</el-button>
            <el-button type="success" @click.stop="delPosts(item, index)">删除</el-button>
          </div>
        </el-col>
      </el-row>
    </li>
  </ul>
</template>

<script>
import axios from "axios";
export default {
  name: "MyPosts",
  data() {
    return {
      //我的帖子列表
      myListPosts: [],
      count: 0
    };
  },
  mounted() {
    this.getPodtdById();
  },
  methods: {
    load() {
      this.count += 2;
    },
    //获取我的帖子信息
    getPodtdById() {
      const token = localStorage.getItem("token");
      if (token === null || token === undefined || token === "") {
        alert("用户未登录");
        return;
      }
      axios
        .get("http://localhost:5000/api/user/myposts", {
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
    },
    //删除
    delPosts(params, index) {
      console.log(params, index);
      //  const token = localStorage.getItem("token");
      axios
        .post("http://localhost:5000/api/user/del/myPosts", {
          data:{
            posts_id:params.id
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
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
  display: flex;
}
</style>