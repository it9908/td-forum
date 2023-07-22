<template>
  <el-row type="flex" justify="space-between">
    <el-col>
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item
          v-for="(r, index) in $route.matched"
          :key="index+'1'"
          :to="{ path: r.path }"
        >{{ r.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="2">
      <div class="info-box">
        <div>
          <span>root</span>
        </div>
        <el-popover placement="top-start" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
          <div
            v-for="(m, index) in menuList"
            :key="index+'menu'"
            class="text item"
            @click="m.method"
          >{{ m.title }}</div>
          <img slot="reference" src="../../assets/bg-2.jpg" />
        </el-popover>
      </div>
    </el-col>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form">
        <el-form-item label="旧密码" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 更换头像 -->
    <el-dialog title="更换头像" :visible.sync="dialogFormVisible2" width="300px">
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
    
  </el-row>
</template>

<script>
export default {
  name: "HeaderNav",
  data() {
    return {
      imageUrl:'',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      formLabelWidth: "60px",
      form: {
        username: "",
        password: ""
      },
      menuList: [
        {
          title: "首页",
          method: () => {
            console.log(1);
          }
        },
        {
          title: "修改密码",
          method: () => {
            this.dialogFormVisible = true;
            console.log(1);
          }
        },
        {
          title: "更换头像",
          method: () => {
            this.dialogFormVisible2 = true;
            console.log(1);
          }
        },
        {
          title: "退出登录",
          method: () => {
            this.$confirm("是否退出?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.$message({
                  type: "success",
                  message: "退出成功!"
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
          }
        }
      ]
    };
  },
  methods:{
    handleAvatarSuccess(){
      console.log();
    }
  }
};
</script>

<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.text {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.item:hover {
  background-color: #f0f0f0;
}
.el-popover {
  min-width: 60px !important;
}
.el-menu {
  border: none;
}
.breadcrumb {
  line-height: 60px;
}
.info-box {
  height: 60px;
  line-height: 60px;
  display: flex;
  div {
    margin-right: 10px;
    box-sizing: border-box;
  }
  img {
    margin-top: 5px;
    width: 50px;
    height: 50px;
    border-radius: 100%;
  }
}
</style>