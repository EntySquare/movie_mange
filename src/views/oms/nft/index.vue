<template>
  <!-- 商品列表页面 -->
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="form" size="small" label-width="140px">
          <el-form-item label="池子号">
            <el-input
              type="number"
              v-model.trim="form.poolId"
              class="input-width"
              placeholder="池子号"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        v-if="authority === 'all'"
        class="btn-add"
        @click="handleAddProduct()"
        size="mini"
      >
        插入池子
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="池子号" width="80" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.poolId }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标题" width="180" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column label="角色A&票数" align="center">
          <template slot-scope="scope">
            <p>角色A : {{ scope.row.roleOne }}</p>
            <p>票数 : {{ scope.row.numberOne }}</p>
          </template>
        </el-table-column>
        <el-table-column label="角色B&票数" align="center">
          <template slot-scope="scope">
            <p>角色B : {{ scope.row.roleTwo }}</p>
            <p>票数 : {{ scope.row.numberTwo }}</p>
          </template>
        </el-table-column>

        <el-table-column label="时间" width="140" align="center">
          <template slot-scope="scope">
            <p>开始时间 : {{ scope.row.startAt }}</p>
            <p>结束时间 : {{ scope.row.endAt }}</p>
          </template>
        </el-table-column>
        <el-table-column label="池子状态" width="140" align="center">
          <template slot-scope="scope">
            <!-- 0-下架 1-进行中 2-结束 -->
            <p>
              {{
                scope.row.status === 0
                  ? "下架"
                  : scope.row.status === 1
                  ? "进行中"
                  : "结束"
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleEndPool(scope.row)"
              v-if="scope.row.status === 1"
            >
              结束池子
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container" v-if="total">
      <el-pagination
        v-if="paginationVisible"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="form.pageNum"
        :page-size="form.pageSize"
        :page-sizes="[5, 10, 15]"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { observerWahlPool, terminateWahlPool } from "@/api/vote";

import store from "@/store";
export default {
  name: "productList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      TakeDownloading: false, // 按钮 loading 状态
      selectedProduct: null, // 当前选中的商品
      loadingProductId: null, // 当前操作的商品 ID

      dialogTitle: "", // 对话框标题
      dialogMessage: "", // 对话框消息
      authority: store.getters.authority, // 从store中获取authority
      form: {
        poolId: "", // 奖池ID
        pageNum: 1, // 页码
        pageSize: 10, // 每页条数
      },
      paginationVisible: true,
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.listLoading = false;
      // this.listLoading = true;
      // const payload = this.form.poolId === "" ? -1 : this.form.poolId;

      // observerWahlPool({
      //   poolId: Number(payload),
      //   pageNum: this.form.pageNum, // 页码
      //   pageSize: this.form.pageSize, // 每页条数
      // })
      //   .then((response) => {
      //     console.log(response);

      //     this.list = response.json;
      //     this.total = response.json.count;
      //     this.listLoading = false;
      //   })
      //   .catch(() => {
      //     this.$message.error("获取商品列表失败，请重试");
      //     this.listLoading = false;
      //   });
    },

    // 结束池子
    handleEndPool(product) {
      if (this.authority !== "all") {
        this.$message.error("暂无修改权限，请联系管理员");
        return;
      }
      this.$confirm("是否要结束该奖池?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          terminateWahlPool({ poolId: product.poolId })
            .then((response) => {
              console.log("response", response);
              this.getList();
              this.$message({
                type: "success",
                message: "结束奖池成功!",
              });
              this.listLoading = false;
            })
            .catch(() => {
              this.listLoading = false;
              this.$message.error(response.json.message_zh);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 添加商品
    handleAddProduct() {
      this.$router.push({ path: "vote/addVote" });
    },

    // 查询搜索
    handleSearchList() {
      this.form.pageNum = 1;
      this.getList();
      this.paginationVisible = false;
    },

    // 重置搜索
    handleResetSearch() {
      this.form = {
        poolId: "",
        pageNum: 1, // 页码
        pageSize: 10, // 每页条数
      };
      this.paginationVisible = true;
      this.getList();
    },

    handleSizeChange(val) {
      this.form.pageNum = 1;
      this.form.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getList();
    },
  },
};
</script>
<style></style>


