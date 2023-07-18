<template>
  <div class="head">
    <el-row>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-image
            style="width: 80px; height: 60px"
            :src="require('@/assets/logo.png')"
            :fit="'cover'"
          ></el-image>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-menu
            router
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#000000"
            text-color="#ffffff"
            active-text-color="#ffffff"
          >
            <el-menu-item index="/home/homes">Home</el-menu-item>
            <el-menu-item index="/forum">forum</el-menu-item>
            <el-menu-item index="/home/login">Login</el-menu-item>
            <el-menu-item index="/home/logon">Logon</el-menu-item>
          </el-menu>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "MyHeader",
  data() {
    return {};
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="less" scoped>
.bg-purple {
  padding-left: 1.25rem;
  padding-top: 0.625rem;
  box-sizing: border-box;
}
.bg-purple-light {
  padding-top: 0.625rem;
  box-sizing: border-box;
}
.grid-content {
  height: 80px;
}
.head {
  height: 5rem;
  width: 100%;
  background: #000000;
}
</style>