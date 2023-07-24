<template>
  <div>
    <el-table :data="tableData" border style="width: 100%;">
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column label="封面" width="200">
        <template slot-scope="scope">
          <el-image style="width: 100%;height: 200px;" :src="scope.row.cover" fit="contain" lazy
            :preview-src-list="[scope.row.cover]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column label="标签" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.tags_list">
            <el-tag v-for="tag in scope.row.tags_list.split(',')" :key="tag" type="success">{{ tag }}</el-tag>
          </template>
          <!-- 将 tags_list 属性的值转换为数组 -->
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" width="300">
        <template slot-scope="scope">
          <div class="content-box" ref="contentBox" v-highlight v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="140">
        <template>
          <el-button type="primary" icon="el-icon-time">待审核</el-button>
        </template>
      </el-table-column>
      <el-table-column label="发布人" width="140">
        <template slot-scope="scope">
          <div class="info-box">
            <span>{{ scope.row.author_nickname }}</span>
            <el-image style="width: 100px; height: 100px;" :src="scope.row.avatar_url" fit="cover"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="210">
        <template slot-scope="scope">
          <el-button size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="primary" size="small">批阅</el-button>
          <el-button type="success" size="small">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="params.currentPage" :page-sizes="pageSizes" :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-drawer size="100%" title="我是标题" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <div class="content-drawer" v-html="currentRowInfo.content" v-highlight v-lineNumbers></div>
    </el-drawer>
  </div>
</template>

<script>

import { draftToBeReviewed } from "@/api/user";
export default {
  name: "ToEXamine",
  data() {
    return {
      drawer: false,
      direction: 'ttb',
      params: {
        currentPage: 1,
        pageSize: 5
      },
      pageSizes: [5, 10, 20, 50],
      total: null,
      currentPage4: 4,
      tableData: [],
      currentRowInfo:[]
    };
  },
  created() {
    this.initTab()

  },
  mounted() {
    // 等待initTab方法执行完成
    this.initTab();

  },
  methods: {
    handleClick(row) {
      this.currentRowInfo = row
      this.drawer = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => { });
    },
    async initTab() {
      const res = await draftToBeReviewed(
        this.params.currentPage,
        this.params.pageSize
      );
      this.tableData = res.data.data;
      this.total = res.data.total;
      console.log(this.tableData);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.params.pageSize = val;
      this.initTab();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.params.currentPage = val;
      this.initTab();
    }
  }
};
</script>

<style lang="less">
.dmk {
  padding: 200px;
}

.el-tag {
  margin: 2px;
}

.content-box {
  img {
    width: 300px;
    height: 200px;
    object-fit: contain;
  }
}
.content-drawer{
  padding: 100px;
  width: 500px;
}

.info-box {
  display: flex;
  line-height: 60px;
  column-gap: 10px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

/* 选用highlight.js提供的样式 */
</style>