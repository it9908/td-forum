<template>
  <el-row>
    <el-col :md="4" :lg="4" :xl="4">
      <el-image
        style="width: 100px;height: 60px"
        :src="require('@/assets/logo.png')"
        :fit="'cover'"
      ></el-image>
    </el-col>
    <el-col :md="20" :lg="20" :xl="20">
      <div class="right">
        <div>
          <span>{{userInfo.username}}</span>
        </div>
        <el-popover placement="top-start" width="150" trigger="hover">
          <el-divider></el-divider>
          <div class="popover-list">
            <span @click.stop="dialogTableVisible = true">修改头像
            </span>
          </div>
          <el-divider></el-divider>
          <div class="popover-list">
            <span @click="isLogout">退出登录
            </span>
          </div>
          <el-divider></el-divider>
          <el-avatar slot="reference" :size="48" :src="userInfo.avatar"></el-avatar>
        </el-popover>
      </div>
    </el-col>
    <el-dialog title="上传头像" :visible.sync="dialogTableVisible" width="20%">
      <el-upload
        class="avatar-uploader"
        name="avatar"
        action="http://localhost:5000/upload/avatar"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <el-image style="width: 300px; height: 300px" v-if="imageUrl" :src="imageUrl" :fit="'fill'"></el-image>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </el-row>
</template>

<script>
import axios from "axios";
export default {
  name: "ConsoleHeader",
  data() {
    return {
      dialogTableVisible: false,
      imageUrl: "",
      userInfo: [],
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  mounted() {
    this.getCurrUserInfo();
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      this.imageUrl = URL.createObjectURL(file.raw);
      this.replacement(file.name);
    },
    //是否退出登录
    isLogout() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.logout();
          this.$message({
            type: "success",
            message: "退出!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 退出登录
    logout() {
      localStorage.removeItem("token");
      this.$router.replace({ name: "Home" });
    },
    // 获取用户信息
    getCurrUserInfo() {
      const token = localStorage.getItem("token");
      if (token === null || token === undefined || token === "") {
        //当未登录时
        const unlisted = {
          username: "未登录",
          avatar: "http://localhost:5000/upload/avatar/3.png"
        };
        this.userInfo = { ...unlisted };
        return;
      }
      // 登录后
      axios
        .get(`/api/current/userinfo`, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        .then(res => {
          this.userInfo = res.data;
          this.imageUrl = "";
          console.log(this.userInfo);
        });
    },
    // 更换头像
    replacement(fileName) {
      axios
        .post(`/api/upload/replace/avatar/${fileName}`, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
        .then(res => {
          console.log(res);
          this.dialogTableVisible = false;
          this.getCurrUserInfo();
        });
    }
  }
};
</script>

<style lang="less" scoped>
@hed-h: 5rem;

.avatar-uploader {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.el-image {
  margin-top: 0.625rem;
}
.right {
  display: flex;
  justify-content: end;
  line-height: @hed-h;
  color: #ffffff;
  .el-avatar {
    margin: 1rem 0 0.625rem 1rem;
  }
}
.popover-list {
  text-align: center;
  line-height: 10px;
  // line-height: 16px;
  span {
    font-size: 18px;
  }
}
</style>