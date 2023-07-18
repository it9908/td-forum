<template>
  <div class="container">
    <div class="header">
      <MyHeader></MyHeader>
    </div>
    <div class="video-bg">
      <video
        id="video"
        autoplay
        muted
        loop
      >
      <source :src="require('@/assets/video/pexels-pressmaster-3129671-3840x2160-30fps.mp4')" type="video/mp4"></video>
    </div>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
import MyHeader from "@/components/ui-header/MyHeader.vue";
export default {
  name: "HomePage",
  components: {
    MyHeader
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.container{
  min-width: 100%;
}
.header {
  z-index: 3000;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.el-main{
    z-index: 2999;
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    position: fixed;
    top: 5rem;
}
.video-bg {
  width: 100%;
  height: 100vh;
  position: relative;
  #video {
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>