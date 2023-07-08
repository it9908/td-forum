<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入id" v-model="input4" @keyup.enter.native="getUserInfoById">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button type="primary" size="mini" @click="getUserInfoById">查找</el-button>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-input placeholder="请输入id" v-model="input4" @keyup.enter.native="getUserInfoById">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button type="primary" size="mini" @click="getUserInfoById">查找</el-button>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入id" v-model="input4" @keyup.enter.native="getUserInfoById">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button type="primary" size="mini" @click="getUserInfoById">查找</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      tooltip-effect="dark"
      :data="listUsers"
      border
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="username" label="昵称" width="180"></el-table-column>
      <el-table-column prop="password" label="密码" width="180"></el-table-column>
      <el-table-column prop="avatar_url" label="图片" width="200">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.avatar_url"
            :fit="'contain'"
            lazy
            :preview-src-list="[scope.row.avatar_url]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="identity" label="权限" width="80"></el-table-column>
      <el-table-column prop="create_time" label="注册时间" width="200"></el-table-column>
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
  name: "AdUsers",
  data() {
    return {
      loading:true,
      input4: "",
      listUsers: [],
      count: undefined,
      arr: [5, 10, 20],
      params: {
        currentPage: 1,
        pageSize: 5
      }
    };
  },
  created() {
    this.initTable();
  },
  methods: {
    //每页n条
    handleSizeChange(val) {
      this.loading = true
      this.params.pageSize = val;
      this.initTable();
      console.log(`每页 ${val} 条`);
    },
    //换页
    handleCurrentChange(val) {
      this.loading = true
      this.params.currentPage = val;
      this.initTable();
      console.log(`当前页: ${val}`);
    },
    // 分页查询
    initTable() {
      axios
        .get(
          `/api/admin/users/${this.params.currentPage}/${this.params.pageSize}`
        )
        .then(res => {
          console.log(res.data);  
          this.loading = false;
          this.listUsers = res.data.items;
          this.count = res.data.totalItems;
        });
    },
    // 根据id查找
    getUserInfoById() {
      alert(1);
    }
  }
};
</script>

<style style lang="less" scoped>
.grid-content {
  display: flex;
}
</style>