<template>
  <div>我是控制台</div>
</template>

<script>
export default {
  name: "AdminConsole",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 获取权限信息
      const userInfo = vm.$store.getters["userData/getUserInfo"].identity;
      console.log(userInfo);
      // 进行权限判断
      if (to.meta.requiresAuth) {
        console.log(userInfo === 2);
        if (userInfo === 2) {
          // 权限为 2，可以进入控制台页
          next();
        } else {
          //不是管理员则导航到论坛页面
          next({ name: "Forum" });
        }
      }
    });
  }
};
</script>

<style lang="less" scoped>
</style>