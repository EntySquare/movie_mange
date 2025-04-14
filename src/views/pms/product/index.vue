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
          <el-form-item label="商品名称：">
            <el-input
              v-model.trim="form.goodsName"
              class="input-width"
              placeholder="商品名称"
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
        添加
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
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="商品图片" width="180" align="center">
          <template slot-scope="scope"
            ><img style="height: 80px" :src="scope.row.imageUrls"
          /></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>标题：{{ scope.row.title ? scope.row.title : "无" }}</p>
            <p>名称：{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">
            <!-- <p>价格：￥{{ scope.row.price }}</p> -->
            <el-input
              v-if="authority === 'all'"
              v-model.number="scope.row.price"
              size="small"
              type="number"
              @change="updatePrice(scope.row)"
            />
            <p v-else>{{ scope.row.price }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库存" width="120" align="center">
          <template slot-scope="scope">
            <!-- modifyGoodsAmount -->
            <!-- {{ scope.row.stock }} -->
            <el-input
              v-if="authority === 'all'"
              v-model.number="scope.row.stock"
              size="small"
              type="number"
              @change="updatestock(scope.row)"
            />
            <p v-else>{{ scope.row.stock }}</p>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.sold }}</template>
        </el-table-column>
        <el-table-column label="描述" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.describe }}</template>
        </el-table-column>
        <el-table-column label="商品状态" width="140" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.status === 1 ? "上架" : "下架" }}</div>
            <el-button
              v-if="authority === 'all'"
              type="text"
              :loading="loadingProductId === scope.row.id"
              @click="confirmToggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? "点击下架" : "点击上架" }}
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

    <!-- 弹窗：确认上架/下架商品 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="400px">
      <span>{{ dialogMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="TakeDownloading"
            @click="toggleProductStatus"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  disableGoods,
  ableGoods,
  modifyGoodsPrice,
  modifyGoodsAmount,
} from "@/api/product";
import store from "@/store";
export default {
  name: "productList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      dialogVisible: false, // 控制弹窗显示
      TakeDownloading: false, // 按钮 loading 状态
      selectedProduct: null, // 当前选中的商品
      loadingProductId: null, // 当前操作的商品 ID

      dialogTitle: "", // 对话框标题
      dialogMessage: "", // 对话框消息
      dialogVisible: false, // 控制对话框显示
      authority: store.getters.authority, // 从store中获取authority
      form: {
        goodsName: "",
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
      this.listLoading = true;
      fetchList(this.form)
        .then((response) => {
          console.log(response);
          this.list = response.json.goodList;
          this.total = response.json.count;
          this.listLoading = false;
        })
        .catch(() => {
          this.$message.error("获取商品列表失败，请重试");
          this.listLoading = false;
        });
    },
    // 打开弹窗，确认操作
    confirmToggleStatus(product) {
      if (this.authority !== "all") {
        this.$message.error("暂无修改权限，请联系管理员");
        return;
      }
      this.selectedProduct = product;
      this.dialogVisible = true;
      this.dialogTitle = product.status === 1 ? "确认下架商品" : "确认上架商品";
      this.dialogMessage =
        product.status === 1 ? "确定要下架该商品吗？" : "确定要上架该商品吗？";
    },

    // 执行上架/下架操作
    toggleProductStatus() {
      if (!this.selectedProduct) return;
      this.TakeDownloading = true;
      this.loadingProductId = this.selectedProduct.id;

      const apiCall =
        this.selectedProduct.status === 1 ? disableGoods : ableGoods;
      apiCall({ goodId: this.selectedProduct.id })
        .then(() => {
          this.$message.success(
            this.selectedProduct.status === 1 ? "商品已下架" : "商品已上架"
          );
          this.selectedProduct.status =
            this.selectedProduct.status === 1 ? 0 : 1;
          this.loadingProductId = null;
          this.getList();
          this.dialogVisible = false;
        })
        .catch(() => {
          this.$message.error("操作失败，请稍后重试");
        })
        .finally(() => {
          this.TakeDownloading = false;
        });
    },

    // 添加商品
    handleAddProduct() {
      this.$router.push({ path: "product/addProduct" });
    },

    // 更新价格
    async updatePrice(row) {
      const newPrice = parseFloat(row.price); // 确保是浮点数
      if (isNaN(newPrice) || newPrice < 0 || newPrice === 0) {
        this.$message.error("价格必须是大于 0 的数字");
        return;
      }
      console.log("111111", newPrice);
      this.listLoading = true;
      modifyGoodsPrice({ goodId: row.id, price: newPrice.toString() })
        .then(() => {
          this.$message.success("修改商品价格成功");
          this.getList(); // 重新获取数据，刷新表格
        })
        .catch(() => {
          this.$message.error("价格更新失败，请重试！");
        })
        .finally(() => {
          this.listLoading = false;
        });
    },

    // 更新库存
    updatestock(row) {
      this.listLoading = true;
      modifyGoodsAmount({ goodId: row.id, number: row.stock.toString() })
        .then(() => {
          this.$message.success("修改商品库存成功");
          this.getList(); // 重新获取数据，刷新表格
        })
        .catch(() => {
          this.$message.error("库存更新失败，请重试！");
        })
        .finally(() => {
          this.listLoading = false;
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
        goodsName: "",
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


