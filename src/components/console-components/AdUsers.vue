<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8">
            <el-input placeholder="请输入id" v-model="user_id" @keyup.enter.native="getUserInfoById">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="14">
            <el-container>
              <el-button type="primary" size="mini" @click="getUserInfoById">查找</el-button>
            </el-container>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8">
            <el-input placeholder="请输入昵称" v-model="keywords" @keyup.enter.native="getUserInfoByName">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :span="14">
            <el-container>
              <el-button type="primary" size="mini" @click="getUserInfoById">查找</el-button>
            </el-container>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      tooltip-effect="dark"
      :data="listUsers"
      border
      :default-sort="{prop: 'id', order: 'descending'}"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="id" width="100" sortable></el-table-column>
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
      <el-table-column prop="identity" label="权限" width="80" sortable></el-table-column>
      <el-table-column prop="create_time" label="注册时间" width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleClick(scope.row)">查看</el-button>
          <el-button size="mini" type="primary" @click="delUser(scope.row)">删除</el-button>
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
    <!-- 查看抽屉 -->
    <el-drawer title="用户信息" :visible.sync="viewDrawer" :direction="'ltr'">
      <div class="pad">
        <el-descriptions title="用户信息" :column="2" border>
          <template slot="extra">
            <!-- 编辑框 -->
            <el-popover placement="right" width="400" trigger="click" v-model="visible">
              <el-form ref="form" :model="currentUserInfo" label-width="80px">
                <el-form-item label="头像">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="currentUserInfo.avatar_url"
                    :fit="'contain'"
                  ></el-image>
                </el-form-item>
                <el-form-item label="id">
                  <el-input v-model="currentUserInfo.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="账号">
                  <el-input v-model="currentUserInfo.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="currentUserInfo.password" disabled></el-input>
                </el-form-item>
                <el-form-item label="权限">
                  <el-input v-model.number="currentUserInfo.identity"></el-input>
                </el-form-item>
                <el-form-item label="注册时间">
                  <el-input v-model="currentUserInfo.create_time" disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="colse">取消</el-button>
                  <el-button type="primary" @click="updateUserIdentity">修改</el-button>
                </el-form-item>
              </el-form>
              <el-button
                slot="reference"
                type="primary"
                size="small"
                @click="editCurrentUserInfo(currentUserInfo)"
              >编辑</el-button>
            </el-popover>
          </template>
          <el-descriptions-item label="id">{{currentUserInfo.id}}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{currentUserInfo.username}}</el-descriptions-item>
          <el-descriptions-item label="密码">{{currentUserInfo.password}}</el-descriptions-item>
          <el-descriptions-item label="头像">
            <el-image
              style="width: 100px; height: 100px"
              :src="currentUserInfo.avatar_url"
              :fit="'contain'"
              lazy
            ></el-image>
          </el-descriptions-item>
          <el-descriptions-item label="权限">{{currentUserInfo.identity}}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{currentUserInfo.create_time}}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AdUsers",
  data() {
    return {
      keywords: "",
      visible: false,
      viewDrawer: false,
      user_id: "",
      loading: true,
      input4: "",
      listUsers: [],
      count: undefined,
      arr: [5, 10, 20],
      params: {
        currentPage: 1,
        pageSize: 5
      },
      // 当前用户信息
      currentUserInfo: []
    };
  },
  created() {
    this.initTable();
  },
  watch: {
    visible(newVal) {
      // 在 visible 属性发生变化时执行逻辑
      if (newVal === false) {
        // 执行某些操作
        this.initTable();
      }
    }
  },
  methods: {
    //每页n条
    handleSizeChange(val) {
      this.loading = true;
      this.params.pageSize = val;
      this.initTable();
      console.log(`每页 ${val} 条`);
    },
    //换页
    handleCurrentChange(val) {
      this.loading = true;
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
      this.loading = true;
      axios
        .get(`/api/admin/getUserInfoById/${this.user_id}`)
        .then(res => {
          console.log(res);
          this.listUsers = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.initTable();
        });
    },
    // 根据昵称模糊查找
    getUserInfoByName() {
      this.loading = true;
      axios
        .get(`/api/admin/getUserInfoByName/${this.keywords}`)
        .then(res => {
          console.log(res);
          this.listUsers = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.initTable();
        });
    },
    //
    handleClick(row) {
      this.viewDrawer = true;
      console.log(row);
      this.currentUserInfo = row;
    },
    //编辑当前用户信息
    editCurrentUserInfo() {
      axios
        .get(`/api/admin/getUserInfoById/${this.currentUserInfo.id}`)
        .then(res => {
          console.log(res.data);
          this.currentUserInfo = res.data[0];
        });
    },
    // 修改用户权限
    updateUserIdentity() {
      const { id, identity } = { ...this.currentUserInfo };
      axios
        .post(`/api/admin/updateUserInfo/${id}`, { identity })
        .then(res => {
          console.log(res.data);
          if (res.data.code === 200) {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 3000
            });
          } else if (res.data.code === 201) {
            this.$notify.error({
              title: "错误",
              message: res.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //
    colse() {
      this.visible = false;
      this.editCurrentUserInfo();
    },
    // 删除用户
    delUser(row) {
      this.$confirm("确定要删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const { id } = { ...row };
          axios.post(`/api/admin/delUser/${id}`).then(res => {
            console.log(res.data);
            if (res.data.code === 200) {
              this.initTable();
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style style lang="less" scoped>
.pad {
  padding: 0px 6px 0px 20px;
}
.el-row {
  margin-bottom: 20px;
}
.el-col-14 {
  display: flex;
  // justify-content: center;
  align-items: center;
}
.grid-content {
  display: flex;
}
</style>