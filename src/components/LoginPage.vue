<template>
  <div class="login-box">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item>
        <span slot="label">
          <span style="color: #ffffff">用户名</span>
        </span>
        <el-input v-model.trim="form.username"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          <span style="color: #ffffff">密码</span>
        </span>
        <el-input placeholder="请输入密码" v-model.trim="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="small" @click="userLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { decodeToken } from "../utils/check";
// import axios from "axios";
import { login } from "@/api/user";
import { parseToken } from "@/utils/authUtils";
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
    async userLogin() {
      if (this.form.username === "" || this.form.password === "") {
        this.$message({
          message: "您还未输入账号或密码",
          type: "warning",
          offset: 100
        });
        return;
      }
      const res = await login(this.form);
      if (res.data.code === 200) {
        // 登录成功，获取到 Token
        const token = res.data.token;
        // 将 token 存储到 Local Storage
        localStorage.setItem("token", token);
        // 获取用户权限
        const { identity } = parseToken(token);
        this.$message({
          message: "登录成功",
          type: "success",
          offset: 100
        });
        setTimeout(() => {
          switch (identity) {
            case 1:
              this.$router.replace({ name: "Forum" });
              break;
            case 2:
              this.$router.replace({ name: "Console" });
              break;
            default:
              this.$router.replace({ name: "Forum" });
          }
        }, 2200);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>