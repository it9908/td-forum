<template>
  <div>
    <el-row type="flex" :gutter="10">
      <el-col>
        <el-input placeholder="请输入id" v-model="postId" @keyup.enter.native="getPostsById">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="getPostsById">查找</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="info" @click="dialog = true">新增</el-button>
      <el-button type="primary" @click="delBatch">批量删除</el-button>
    </el-row>
    <el-drawer
      title="发布新帖"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer"
      :size="'50%'"
      
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="标题" label-width="80px">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="内容" label-width="80px">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="上传封面" label-width="80px">
            <el-upload
              class="upload-demo"
              name="image"
              :limit="1"
              action="http://localhost:5000/upload/image"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleUploadSuccess"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            @click="$refs.drawer.closeDrawer()"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      :data="listPosts"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="user_id" label="发布者id" width="100"></el-table-column>
      <el-table-column prop="title" label="标题" width="300"></el-table-column>
      <el-table-column prop="content" label="内容" width="500"></el-table-column>
      <el-table-column prop="image_url" label="图片" width="300">
        <template slot-scope="scope">
          <el-image
            style="width: 160px; height: 120px"
            :src="scope.row.image_url"
            :fit="'contain'"
            lazy
            :preview-src-list="[scope.row.image_url]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="publish_time" label="发布时间" width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope>
          <el-button size="mini" type="danger">查看</el-button>
          <el-button size="mini" type="primary">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.currentPage"
        :page-sizes="arr"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<style style lang="less" scoped>
.el-row {
  margin-bottom: 10px;
}
.el-col {
  display: flex;
}
.demo-drawer__content {
  padding: 30px;
}
</style>

<script>
import axios from "axios";
// import { get, post } from "../../axios/api";
export default {
  name: "AdPosts",
  data() {
    return {
      // 需要查找的帖子id
      postId:'',
      // 图片上传成功队列
      fileList: [],
      dialog: false,
      loading: false,
      // 帖子列表
      listPosts: [],
      count: undefined,
      arr: [5, 10, 20],
      params: {
        currentPage: 1,
        pageSize: 5
      },
      form: {
        title: "",
        content: ""
      },
      // 存放需要被删除帖子id
      multipleSelection: []
    };
  },
  created() {
    this.initTable();
  },
  methods: {
    // 通过id查找
    getPostsById(){
      // if(this.postId === '' || this.postId === undefined || this.postId === null){
      //   this.initTable()
      //   return
      // }
      // get(`/api/admin/getPostsById/${this.postId}`)
      // .then(res=>{
      //     console.log(res);
      //     this.listPosts = res.data
      // })
    },
    // 批量删除帖子
    delBatch() {
      // console.log(this.multipleSelection);
      // this.$confirm("此操作将永久删除帖子, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     post("/api/admin/delSelectPost", this.multipleSelection).then(res => {
      //       console.log(res);
      //       if (res.data.code === 200) {
      //         this.$message({
      //           message: "删除成功",
      //           type: "success"
      //         });
      //         this.initTable();
      //       }
      //     });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消删除"
      //     });
      //   });
    },
    handleSelectionChange(val) {
      // 获取需要被删除用户的id
      this.multipleSelection = val.map(obj => obj.id);
      // console.log(this.multipleSelection);
    },
    // 发布提交
    submit() {
      console.log("提交");
      const form = {
        title: this.form.title,
        content: this.form.content,
        image: this.fileList[0].raw
      };
      axios
        .post("/api/upload/posts/create", form, {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 200) {
            this.initTable();
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.form.title = '',
            this.form.content = '',
            this.fileList = []
          }
          this.initTable()
        })
        .catch(() => {});
    },
    // 上传成功时
    handleUploadSuccess(response, file, fileList) {
      // 处理上传成功的逻辑，例如添加文件到 fileList
      this.fileList = fileList;
      console.log(this.fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm("确定要提交表单吗？")
        .then(() => {
          this.loading = true;
          this.timer = setTimeout(() => {
            this.submit();
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 1000);
        })
        .catch(() => {});
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.initTable();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.params.currentPage = val;
      this.initTable();
      console.log(`当前页: ${val}`);
    },
    // 分页查询
    // initTable() {
    //   axios
    //     .get(
    //       `/api/admin/items/${this.params.currentPage}/${this.params.pageSize}`
    //     )
    //     .then(res => {
    //       console.log(res.data);
    //       this.listPosts = res.data.items;
    //       this.count = res.data.totalItems;
    //     });
    // }
  }
};
</script>

