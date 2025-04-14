<template>
   
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
          <el-form-item label="用户名：">
            <el-input
              v-model.trim="form.userName"
              class="input-width"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <!-- <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button> -->
    </el-card>
    <div class="table-container">
      <el-table
        ref="adminTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <!-- account : "0xc6dde1c85adcb2982cf4e79f835d32a3b66df08b" address :
        "0xc6dde1c85adcb2982cf4e79f835d32a3b66df08b" buyerAddr : "" flag : "1"
        identity : 1 userId : 7 userName :
        "0xc6dde1c85adcb2982cf4e79f835d32a3b66df08b" -->

        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="帐号" align="center">
          <template slot-scope="scope">{{ scope.row.account }}</template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>

        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.buyerAddr">
              <div v-if="isJson(scope.row.buyerAddr)">
                <div
                  v-for="(value, key) in parseJson(scope.row.buyerAddr)"
                  :key="key"
                >
                  <strong>{{ formatKey(key) }}:</strong> {{ value }}
                </div>
              </div>
              <div v-else>
                {{ scope.row.buyerAddr }}
              </div>
            </div>
            <div v-else>无收货地址</div>
          </template>
        </el-table-column>

        <el-table-column label="是否启用" width="140" align="center">
          <!-- flag 0 禁用 1 启用 -->
          <template slot-scope="scope">
            <!-- 禁用 -->
            <el-switch
              :disabled="authority !== 'all'"
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="'1'"
              :inactive-value="'0'"
              v-model="scope.row.flag"
            >
            </el-switch>
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
import { fetchList, disableUsers, ableUsers } from "@/api/login";
import store from "@/store";

export default {
  name: "adminList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      authority: store.getters.authority, // 从store中获取authority

      paginationVisible: true,
      form: {
        userName: "",
        pageNum: 1, // 页码
        pageSize: 10, // 每页条数
      },
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.form)
        .then((response) => {
          console.log("response", response);

          this.list = response.json.usersList;
          this.total = response.json.count;
          this.listLoading = false;
        })
        .catch(() => {
          this.$message.error("获取用户列表失败，请重试");
          this.listLoading = false;
        });
    },

    // 修改状态（启用 / 禁用）
    handleStatusChange(index, row) {
      const isEnable = row.flag === "1" || row.flag === 1; // 判断是否是启用操作
      const action = isEnable ? "启用" : "禁用"; // 操作类型
      const apiFunction = isEnable ? ableUsers : disableUsers; // 选择对应的 API 方法

      this.$confirm(`是否要${action}该用户？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          apiFunction({ userId: row.userId }) // 调用对应的 API
            .then(() => {
              this.$message({
                type: "success",
                message: `${action}用户成功!`,
              });
              this.getList(); // 刷新用户列表
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: `${action}用户失败，请重试!`,
              });
              this.getList();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改",
          });
          this.getList();
        });
    },

    // 判断是否为有效的 JSON 字符串
    isJson(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    },

    // 解析 JSON 字符串
    parseJson(str) {
      try {
        return JSON.parse(str);
      } catch (e) {
        return null;
      }
    },

    // 格式化键名，使显示更加友好
    formatKey(key) {
      const format = {
        email: "邮箱",
        country: "国家",
        province: "省份",
        city: "城市",
        postcode: "邮政编码",
        apartment: "公寓",
        firstName: "名",
        lastName: "姓",
        phone: "电话",
      };
      return format[key] || key;
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
        userName: "",
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


