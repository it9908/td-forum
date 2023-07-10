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
import { decodeToken } from "../utils/check";
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
  methods: {
    //登录
    login() {
      axios
        .post("/api/login", this.form)
        .then(response => {
          // 登录成功，获取到 Token
          const token = response.data.token;
          // 将 token 存储到 Local Storage
          localStorage.setItem("token", token);
          const decodedToken = decodeToken(token);
          console.log(decodedToken);
          switch (decodedToken.identity) {
            case 1:
              this.$router.replace({ name: "Forum" });
              break;
            case 2:
              this.$router.replace({ name: "Console" });
              break;
            default:
              this.$router.replace({ name: "Forum" });
          }
        })
        .catch(error => {
          // 处理登录失败的情况
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