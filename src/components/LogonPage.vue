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
import axios from "axios";
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
  methods: {
    //注册
    logon() {
      axios
        .post("/api/logon", this.form)
        .then(res => {
          console.log(res);
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
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

