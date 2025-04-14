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
          <el-form-item label="订单编号：">
            <el-input
              v-model.trim="form.orderNo"
              class="input-width"
              placeholder="订单编号"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="订单的序列号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.seq }}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
        </el-table-column>

        <el-table-column label="用户地址" align="center" width="140">
          <template slot-scope="scope">{{ scope.row.user }}</template>
        </el-table-column>
        <el-table-column label="商品名称" width="140" align="center">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <el-table-column label="交易哈希" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.hash }}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.number }}</template>
        </el-table-column>
        <el-table-column label="商品价格" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.number }}</template>
        </el-table-column>
        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">
            <p>
              <strong>Email:</strong>

              {{ scope.row.address.email ? scope.row.address.email : "无" }}
            </p>
            <p>
              <strong>国家:</strong>
              {{ scope.row.address.country ? scope.row.address.country : "无" }}
            </p>
            <p>
              <strong>省份:</strong>
              {{
                scope.row.address.province ? scope.row.address.province : "无"
              }}
            </p>
            <p>
              <strong>城市:</strong>
              {{ scope.row.address.city ? scope.row.address.city : "无" }}
            </p>
            <p>
              <strong>邮政编码:</strong>
              {{
                scope.row.address.postcode ? scope.row.address.postcode : "无"
              }}
            </p>

            <p>
              <strong>公寓号:</strong>
              {{
                scope.row.address.apartment ? scope.row.address.apartment : "无"
              }}
            </p>

            <p>
              <strong>名字:</strong>
              {{
                scope.row.address.firstName
                  ? scope.row.address.firstName +
                    " " +
                    scope.row.address.lastName
                  : "无"
              }}
            </p>
            <p>
              <strong>电话:</strong>
              {{ scope.row.address.phone ? scope.row.address.phone : "无" }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="140" align="center">
          <template slot-scope="scope">
            <!-- 0=待付款 1=已付款 -1=付款失败/取消付款 2=退款中 3=退款成功 4=退款失败/取消 -->
            <p>
              {{ statusMap[scope.row.status] }}
            </p>
            <el-button
              v-if="authority === 'all'"
              type="text"
              @click="openStatusDialog(scope.row)"
            >
              修改状态
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <!-- 0=待付款 1=已付款 -1=付款失败/取消付款 2=退款中 3=退款成功 4=退款失败/取消 -->

            <el-button
              v-if="authority === 'all' && scope.row.status === '1'"
              type="text"
              @click="handleDelivery(scope.row)"
            >
              订单发货
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

    <el-dialog title="修改订单状态" :visible.sync="dialogVisible" width="36%">
      <el-form v-loading="dialogLoading">
        <el-form-item label="订单状态">
          <el-select
            v-model="selectedStatus"
            placeholder="请选择订单状态"
            style="width: 70%"
          >
            <el-option
              v-for="(label, value) in statusMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 42%" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button
            style="width: 42%"
            type="primary"
            @click="updateOrderStatus"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, modifyPurchaseStatus, deliverpurchase } from "@/api/order";
import store from "@/store";
export default {
  name: "orderList",
  data() {
    return {
      form: {
        orderNo: "",
        pageNum: 1, // 页码
        pageSize: 10, // 每页条数
      },
      authority: store.getters.authority, // 从store中获取authority
      paginationVisible: true,
      listLoading: true,
      list: null,
      total: null,
      dialogVisible: false, // 控制弹窗的显示
      selectedOrder: null, // 记录当前操作的订单
      selectedStatus: "", // 选中的订单状态
      dialogLoading: false,
      statusMap: {
        0: "待付款",
        1: "已付款",
        "-1": "付款失败/取消付款",
        2: "退款中",
        3: "退款成功",
        4: "退款失败/取消",
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
          this.list = response.json.purchaseList;
          this.total = response.json.count;
          this.listLoading = false;
        })
        .catch(() => {
          this.$message.error("获取订单列表失败，请重试");
          this.listLoading = false;
        });
    },

    openStatusDialog(order) {
      this.selectedOrder = order;
      this.selectedStatus = order.status;
      this.dialogVisible = true;
    },
    // 更新订单状态
    updateOrderStatus() {
      if (this.selectedOrder) {
        this.dialogLoading = true;
        this.selectedOrder.status = this.selectedStatus;
        // 调用 API 更新状态（可选）
        modifyPurchaseStatus({
          hash: this.selectedOrder.hash,
          status: this.selectedOrder.status.toString(),
        })
          .then(() => {
            this.$message.success("订单状态更新成功！");
            this.dialogVisible = false;
            this.selectedOrder = null; // 清空
            this.selectedStatus = ""; // 清空
            this.getList();
          })
          .catch(() => {
            this.$message.error("更新失败，请重试！");
          })
          .finally(() => {
            this.dialogLoading = false;
          });
      }
    },

    // 发货
    handleDelivery(row) {
      this.$confirm("是否确认发货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // string json:"hash"
          // string json:"trackingNumber
          // 区块链交易哈希
          // 物流单号
          this.listLoading = true;
          deliverpurchase({
            hash: row.hash,
            trackingNumber: row.orderNo,
          })
            .then((response) => {
              console.log("response", response);
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.getList();
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

    // 查询搜索
    handleSearchList() {
      this.form.pageNum = 1;

      this.getList();
      this.paginationVisible = false;
    },

    // 重置搜索
    handleResetSearch() {
      this.form = {
        orderNo: "",
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
<style scoped>
.input-width {
  width: 203px;
}
</style>


