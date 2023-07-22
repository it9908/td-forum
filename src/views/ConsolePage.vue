<template>
  <div class="main-container">
    <div class="asides">
      <AsideNav></AsideNav>
    </div>
    <el-main>
      <el-container>
        <el-header>
          <HeaderNav></HeaderNav>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-main>
  </div>
</template>

<style lang="less" scoped>
.main-container {
  min-height: 100vh;
  display: flex;
  .aside{
    padding: 0;
  }
  .el-main {
    flex: 1;
    padding: 6px;
    background: #f1f2f6;
  }
  .el-header{
    border: 1px solid #ffffff;
    background: #dfe4ea;
  }
}
</style>

<script>
// import
export default {
  components: {
    AsideNav: () => import("@/components/console-aside/AsideNav.vue"),
    HeaderNav: () => import("@/components/console-main/HeaderNav.vue")
  },
  data() {
    return {
      isSmallScreen: false
    };
  },
  created() {
    this.checkScreenWidth();
    window.addEventListener("resize", this.checkScreenWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenWidth);
  },
  methods: {
    checkScreenWidth() {
      this.isSmallScreen = window.innerWidth < 1280;
      console.log(this.isSmallScreen);
    }
  }
};
</script>