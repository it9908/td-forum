<template>
  <div class="login-box">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item>
        <span slot="label">
          <span style="color: #ffffff">用户名</span>
        </span>
        <el-input placeholder="只能输入5-11位的用户名" v-model.trim="form.username"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          <span style="color: #ffffff">密码</span>
        </span>
        <el-input placeholder="6-12位字母大小写+数字组合" v-model.trim="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          <span style="color: #ffffff">重复密码</span>
        </span>
        <el-input placeholder="请重复密码" v-model.trim="form.password2" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="logon">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.login-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: #ffffff;
  }
}
</style>

<script>
// import axios from "axios";
import { register } from "@/api/user";
export default {
  name: "LogonPage",
  data() {
    return {
      //登录信息
      form: {
        //账号
        username: "",
        //密码
        password: "",
        password2: ""
      }
    };
  },
  computed: {
    // 验证密码重复
    repeatPwd() {
      const { password, password2 } = { ...this.form };
      return password2 === password;
    }
  },
  methods: {
    // 验证用户名、密码格式
    processingFormat() {
      const { username, password } = { ...this.form };
      if (
        username.length < 5 ||
        username.length > 12 ||
        password.length < 6 ||
        password.length > 12
      ) {
        return false;
      }
      // 验证用户名格式
      const regexName = /^[a-zA-Z0-9]{5,11}$/;
      // 验证密码格式
      const regexPwd = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/;
      const isName = regexName.test(username);
      const isValid = regexPwd.test(password);
      if (isName && isValid) {
        return true;
      } else {
        return false;
      }
    },
    //注册
    async logon() {
      if (!this.processingFormat()) {
        this.$message({
          message: "用户名或密码格式错误~~",
          type: "warning",
          offset: 100
        });
        return;
      }
      if (!this.repeatPwd) {
        this.$message({
          message: "重复密码错误，请仔细检查~~~",
          type: "warning",
          offset: 100
        });
        return;
      }
      if (this.processingFormat() && this.repeatPwd) {
        try {
          const { username, password } = this.form;
          const formData = { username, password };
          const res = await register(formData);
          console.log(res.data);
          if (res.data.code === 200) {
            this.$message({
              message: res.data.message,
              type: "success",
              offset: 100
            });
            setTimeout(() => {
              this.$router.replace({ name: "Login" });
            }, 2000);
            return;
          }
          this.$message({
            message: res.data.message,
            type: "warning",
            offset: 100
          });
        } catch (error) {
          this.$message.error("服务器错误~~");
        }
      }
    }
  }
};
</script>

