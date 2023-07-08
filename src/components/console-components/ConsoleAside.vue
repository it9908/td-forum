<template>
  <el-menu
    default-active="/console/users"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    router
    active-text-color="#ffd04b"
  >
    <el-submenu index="1" style="width: 180px">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>系统管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/console/users">用户管理</el-menu-item>
        <el-menu-item index="/console/posts">帖子管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "ConsoleAside"
};
</script>

<style lang="less" scoped>
/deep/ .el-menu-item-group__title {
  padding: 0;
}
/deep/ .el-submenu .el-menu-item {
  min-width: 180px;

}
</style>