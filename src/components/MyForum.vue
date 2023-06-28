<template>
  <div class="container">
    <el-row>
      <el-row :gutter="10">
        <el-col :xs="4" :sm="6" :md="2" :lg="4" :xl="5">
          <div class="grid-content bg-purple-light">
            <router-link to="/forum">全部帖子</router-link>
          </div>
        </el-col>
        <el-col :xs="4" :sm="6" :md="20" :lg="16" :xl="14">
          <div class="grid-content-center bg-purple">
            <router-view></router-view>
          </div>
        </el-col>
        <el-col :xs="8" :sm="6" :md="2" :lg="4" :xl="5">
          <div class="grid-content grid-content-right">
            <el-avatar :size="60" :src="userInfo.avatar"></el-avatar>
            <el-row>
              <span>{{userInfo.username}}</span>
            </el-row>
            <el-row class="s-box" :gutter="10">
              <el-col :span="12">
                <div class="grid-content-s">
                  <i class="el-icon-chat-line-square"></i>
                  <router-link to="/forum/myposts">我的帖子</router-link>
                  
                </div>
              </el-col>
             <el-col :span="12">
                <div class="grid-content-s">
                  <i class="el-icon-chat-line-square"></i>
                  <router-link to="/forum/mycomment">我的评论</router-link>
                </div>
              </el-col>
            </el-row>
          </div>
          <div></div>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "MyForum",
  data() {
    return {
      //当前用户信息
      userInfo:[]
    };
  },
  mounted() {
    this.getListPosts();
    this.getCurrUserInfo()
  },
  computed: {
    //用户信息
    // userInfo() {
    //   return this.$store.getters["userData/getUserInfo"];
    // },

  },
  methods:{
    //帖子列表
    getListPosts(){
      axios.get('http://localhost:5000/api/admin/getPostList')
      .then(res=>{
        console.log(res);
      })
    },
    //用户信息
    getCurrUserInfo(){
      const token = localStorage.getItem('token');
      axios.get('http://localhost:5000/api/user/current/userinfo',{
        headers:{
          Authorization: token
        }
      })
      .then(res=>{
        console.log(res.data);
        this.userInfo = res.data
      })
    }
  }
};
</script>

<style lang="less" scoped>
.s-box{
  border: 1px solid ;
}
.grid-content-center{
  background: #ffffff;
}
.grid-content-s{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container {
  padding: 0.625rem;
  box-sizing: border-box;
  height: 100vh;
  background: url("../assets/bg-2.jpg") no-repeat;
  background-size: cover;
}
.grid-content-right {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.grid-content {
  background: rgba(255, 255, 255, 0.5);
}
</style>