<template>
  <div class="login-box">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item>
        <span slot="label">
          <span style="color: #ffffff">账号</span>
        </span>
        <el-input v-model.trim="form.username"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          <span style="color: #ffffff">密码</span>
        </span>
        <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" size="small" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginPage",
  data() {
    return {
      //登录信息
      form: {
        //账号
        username: "",
        //密码
        password: ""
      }
    };
  },
  mounted() {},
  computed: {
    // token() {
    //   return this.$store.getters["userData/getToken"];
    // },
    isAuth() {
      return this.$store.getters["userData/userInfo"];
    }
  },
  methods: {
    //登录
    login() {
      axios
        .post("http://localhost:5000/api/user/login", this.form)
        .then(response => {
          // 登录成功，获取到 Token
          const token = response.data.token;
          // 将 token 存储到 Local Storage
          localStorage.setItem("token", token);

          // 将 Token 存储到 Vuex 的 userData 模块中
          this.$store.dispatch("userData/saveToken", token).then(() => {
            // Token 存储完成后，通过 Token 获取用户信息
            this.fetchUserInfoAndRedirect();
          });
        })
        .catch(error => {
          // 处理登录失败的情况
          console.log(error);
        });
    },

    // 获取用户信息并进行路由跳转
    fetchUserInfoAndRedirect() {
      const token = localStorage.getItem('token');
      // 使用 Token 获取用户信息
      axios
        .get("http://localhost:5000/api/user/current/userinfo", {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          // 获取到用户信息
          const userInfo = response.data;
          console.log(userInfo);
          // 将用户信息存储到 Vuex 的 userData 模块中
          this.$store.dispatch("userData/saveUserInfo", userInfo).then(() => {
            this.$router.replace("/console");
          });
        })
        .catch(error => {
          // 处理获取用户信息失败的情况
          console.log(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.el-form-item:nth-of-type(3) {
  display: flex;
  justify-content: center;
  .btn {
    width: 100%;
  }
}
.login-box {
  width: 340px;
  padding-top: 1.25rem;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>