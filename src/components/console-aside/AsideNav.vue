<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    :collapse="isSmallScreen"
    @open="handleOpen"
    @close="handleClose"
    background-color="#576574"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item index="/console/default" style="padding:0">
      <div class="logo">
        <el-image style="width:60px;" :src="require('@/assets/logo.png')" fit="cover"></el-image>
      </div>
    </el-menu-item>
    <el-menu-item index="/console/default">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/console/home">
      <i class="el-icon-menu"></i>
      <span slot="title">帖子管理</span>
    </el-menu-item>
    <el-menu-item index="/console/user">
      <i class="el-icon-menu"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-menu-item index="/console/post">
      <i class="el-icon-menu"></i>
      <span slot="title">发布帖子</span>
    </el-menu-item>
    <el-menu-item index="/console/toexamine">
      <i class="el-icon-menu"></i>
      <span slot="title">内容审核</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="less" scoped>
.logo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background: #000000;
  justify-content: center;
  .el-image {
    display: flex;
    justify-content: center;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 100%;
}
.el-menu {
  border: none;
  .el-menu-item {
    padding: 0;
    box-sizing: border-box;
  }
}
</style>

<script scoped>
export default {
  name: "AsideNav",
  data() {
    return {
      isSmallScreen: false
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    checkScreenWidth() {
      this.isSmallScreen = window.innerWidth < 1280;
      console.log(this.isSmallScreen);
    }
  },
  created() {
    this.checkScreenWidth();
    window.addEventListener("resize", this.checkScreenWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenWidth);
  }
};
</script>