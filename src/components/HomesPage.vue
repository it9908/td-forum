<template>
  <div class="container-box">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in lists" :key="item.id">
        <transition name="fade-up" :duration="{ enter: 500, leave: 0 }">
          <div class="grid-content bg-purple">
            <div class="posts-title">{{ item.title }}</div>
            <el-image class="img" style="width: 100%;" :src="item.image_url" :fit="'cover'">
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <el-link target="_blank">了解一下</el-link>
          </div>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      lists: []
    };
  },
  mounted() {
    this.postsList();
  },
  methods: {
    
    postsList() {
      axios.get("/api/admin/getPostList").then(res => {
        const arr = res.data.data;
        arr.splice(4);
        this.lists = arr;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-link {
  color: #ffffff;
}
div {
  color: #f9fafc;
}
.container-box {
  width: 100%;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  .posts-title {
    font-size: 1.625rem;
    font-weight: 400;
  }
  .img {
    margin: 0.625rem 0;
    box-sizing: border-box;
  }
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>