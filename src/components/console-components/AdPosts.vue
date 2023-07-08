<template>
  <div>
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      :data="listPosts"
      border
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="user_id" label="发布者id" width="100"></el-table-column>
      <el-table-column prop="title" label="标题" width="300"></el-table-column>
      <el-table-column prop="content" label="内容" width="500"></el-table-column>
      <el-table-column prop="image_url" label="图片" width="300">
        <template slot-scope="scope">
          <el-image style="width: 160px; height: 120px" :src="scope.row.image_url" :fit="'contain'" lazy :preview-src-list="[scope.row.image_url]"></el-image>
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

<script>
import axios from "axios";
export default {
  name: "AdPosts",
  data() {
    return {
      listPosts: [],
      count: undefined,
      arr:[5, 10, 20],
      params:{
        currentPage:1,
        pageSize:5
      }
    };
  },
  created(){
    this.initTable()
  },
  methods: {
    handleSizeChange(val) {
      this.params.pageSize = val
      this.initTable()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
       this.params.currentPage = val
      this.initTable()
      console.log(`当前页: ${val}`);
    },
    // 分页查询
    initTable(){
      axios.get(`/api/admin/items/${this.params.currentPage}/${this.params.pageSize}`)
      .then(res=>{
        console.log(res.data);
        this.listPosts = res.data.items
        this.count = res.data.totalItems;
      })
    }
  }
};
</script>

<style style lang="less" scoped>
</style>