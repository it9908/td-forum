<template>
  <div class="outer-container">
    <el-header style="height:5rem;width:100vw">
      <ConsoleHeader></ConsoleHeader>
    </el-header>
    <div class="inner-container">
      <el-aside width="180px">
        <ConsoleAside></ConsoleAside>
      </el-aside>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">活动管理</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-main>
        <router-view></router-view>
      </el-main>
    </div>
  </div>
</template>

<script>
// import ConsoleHeader from "@/components/console-components/ConsoleHeader.vue";
// import ConsoleAside from "@/components/console-components/ConsoleAside.vue";
export default {
  components: {
    // ConsoleHeader,
    // ConsoleAside
  },
  name: "AdminConsole"
};
</script>

<style lang="less" scoped>
.outer-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}
.inner-container {
  display: flex;
  flex: 1;
}
.el-main {
  padding: 0.625rem;
}
.el-header {
  background: #222f3e;
}
.el-aside {
  background: #576574;
}
</style>