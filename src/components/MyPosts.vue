<template>
  <div class="box">
    我的帖子
  </div>
</template>

<script>
export default {
    name:"MyPosts",
    data(){
        return{
            //我的帖子列表
            listPosts:[]
        }
    },
    methods:{
        //获取我的帖子信息
        
    }
}
</script>

<style lang="less" scoped>
.box{
    background: red;
}
</style>