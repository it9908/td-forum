<template>
  <div class="outer-container">
    <el-header style="height:5rem">
      <ConsoleHeader></ConsoleHeader>
    </el-header>
    <div class="inner-container">
      <el-aside width="180px">
        <ConsoleAside></ConsoleAside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </div>
  </div>
</template>

<script>
import ConsoleHeader from "@/components/console-components/ConsoleHeader.vue";
import ConsoleAside from "@/components/console-components/ConsoleAside.vue";
export default {
  components: {
    ConsoleHeader,
    ConsoleAside
  },
  name: "AdminConsole"
};
</script>

<style lang="less" scoped>
.outer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.inner-container {
  display: flex;
  flex: 1;
}
.el-main {
  // flex: 1;
  padding: 0.625rem;
}
.el-header {
  background: #222f3e;
}
.el-aside {
  background: #576574;
}
</style>