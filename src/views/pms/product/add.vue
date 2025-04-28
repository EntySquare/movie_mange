<template>
  <div class="add-goods">
    <el-card>
      <h2>添加商品</h2>
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="productForm.title" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="productForm.name" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.trim="productForm.price" type="number" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model.trim="productForm.stock" type="number" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-input v-model.trim="productForm.image" />
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input type="textarea" v-model.trim="productForm.describe" />
        </el-form-item>
      </el-form>

      <div class="btn-group">
        <el-button @click="$router.back()">返回</el-button>
        <el-button type="primary" :loading="loading" @click="submitProduct">
          确定
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { insertNewGoods } from "@/api/product";
import store from "@/store";
export default {
  name: "productAdd",
  data() {
    return {
      loading: false,
      authority: store.getters.authority, // 从store中获取authority
      productForm: {
        title: "",
        name: "",
        price: null,
        stock: null,
        image: "",
        describe: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        price: [{ required: true, message: "请输入价格", trigger: "change" }],
        stock: [{ required: true, message: "请输入库存", trigger: "change" }],
        image: [
          { required: true, message: "请输入图片地址", trigger: "change" },
        ],
        describe: [
          { required: true, message: "请输入描述", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    submitProduct() {
      if (this.authority !== "all") {
        this.$message.error("无权限操作");
        return;
      }
      this.$refs.productFormRef.validate((valid) => {
        if (!valid) {
          this.$message.error("请填写完整信息");
          return;
        }

        this.loading = true;
        this.productForm.price = parseFloat(this.productForm.price);
        this.productForm.stock = parseInt(this.productForm.stock);
        insertNewGoods(this.productForm)
          .then(() => {
            this.$message.success("商品添加成功");
            this.$refs.productFormRef.resetFields(); // 清空表单、
            //跳转到商品列表页面
            this.$router.push({ path: "/pms/product" });
          })
          .catch(() => {
            this.$message.error("添加失败，请稍后重试");
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>

<style scoped>
.add-goods {
  max-width: 700px;
  margin: 60px auto;
  padding: 20px 20px;
}
.btn-group {
  display: flex;
  justify-content: space-between;
}
</style>
