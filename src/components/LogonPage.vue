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
        <el-button class="btn" size="small" @click="logon">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "LogonPage",
  data(){
    return{
      //登录信息
      form:{
        //账号
        username:'',
        //密码
        password:'',
      }
    }
  },
  methods:{
    //注册
    logon(){
      axios.post('http://localhost:5000/api/user/logon',this.form)
      .then(res=>{
        console.log(res);
        this.$router.replace({name:'Login'})
      })
      .catch(err=>{
        console.log(err);
      })
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