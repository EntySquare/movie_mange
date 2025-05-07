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
        <!-- <el-form-item label="图片" prop="image">
          <el-input v-model.trim="productForm.image" />
        </el-form-item> -->
        <el-form-item label="主图" prop="image">
          <el-upload
          ref="upload-image"
          class="upload-image"
          action=""
          :limit="1"
          :file-list="imageList"
          :auto-upload="false"
          :show-file-list="true"
          list-type="picture-card"
          :on-preview="handlePreview"
          :on-change="imageOnChange"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :before-upload="(file) => { 
            productForm.image = file;
            imageList = [file];
            console.log('file:', file);
            //return false;  
          }"
        >
        <i v-if="imageList.length === 0" class="el-icon-plus" />
          </el-upload>
          <!-- 用于隐藏绑定上传地址到表单 -->
          <input type="hidden" v-model="productForm.image" />
        </el-form-item>

        <el-form-item label="封面图" prop="cover">
          <el-upload
        ref="upload-cover"
        class="upload-cover"
        action=""
        :limit="1"
        :file-list="coverList"
        :auto-upload="false"
        :show-file-list="true"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-change="coverOnChange"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :before-upload="(file) => { 
          productForm.cover = file;
          coverList = [file];
          //return false;  
        }"
      >
      <i v-if="coverList.length === 0" class="el-icon-plus" />
          </el-upload>
          <!-- 用于隐藏绑定上传地址到表单 -->
          <input type="hidden" v-model="productForm.cover" />

        </el-form-item>

        <el-form-item label="描述" prop="describe">
          <el-input type="textarea" v-model.trim="productForm.describe" style="margin-top: 0px;"/>
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
        image: null, //File 类型
        cover: null, //File 类型
        describe: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        price: [{ required: true, message: "请输入价格", trigger: "change" }],
        stock: [{ required: true, message: "请输入库存", trigger: "change" }],
        image: [
          { required: true, message: "请上传主图", trigger: "change" },
        ],
        cover: [
          { required: true, message: "请上传封面图", trigger: "change" },
        ],
        describe: [
          { required: true, message: "请输入描述", trigger: "change" },
        ],
      },
      // 上传文件列表
      imageList: [],
      coverList: [],
    };
  },
  methods: {
    imageOnChange(file) {
      this.productForm.image = file;
      this.imageList = [file];
      //console.log("file:", this.productForm.image);
    },
    coverOnChange(file) {
      this.productForm.cover = file;
      this.coverList = [file];
      //console.log("file:", file);
    },
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
        //this.productForm.price = parseFloat(this.productForm.price);
        //this.productForm.stock = parseInt(this.productForm.stock);


        insertNewGoods({
            imageFile: this.productForm.image,   // 这是 File 类型
            coverFile: this.productForm.cover,   // 这是 File 类型
            title: this.productForm.title,
            name: this.productForm.name,
            price: this.productForm.price,
            stock: this.productForm.stock,
            describe: this.productForm.describe
          })
          .then(() => {
            this.$message.success("商品添加成功");
            this.$refs.productFormRef.resetFields(); // 清空表单、
            //跳转到商品列表页面
            //this.$router.push({ path: "/pms/product" });
          })
          .catch(() => {
            this.$message.error("添加失败，请稍后重试");
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },

    // 上传前校验类型
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        this.$message.error("只能上传图片文件！");
      }
      return isImage;
    },
    // 删除图片
    handleRemove() {
      this.productForm.image = "";
      this.imageList = [];
    },
    // 点击图片预览（可选）
    handlePreview(file) {
      this.$alert(`<img src="${file.url}" style="width: 100%;" />`, "图片预览", {
        dangerouslyUseHTMLString: true,
      });
    },

    handleExceed(files) {
      const file = files[0];
      // 清除旧文件
      this.$refs.upload.clearFiles();
      // 生成唯一 ID 并手动添加文件
      file.uid = Date.now() + '_' + Math.random(); // 简化版 genFileId
      this.$refs.upload.handleStart(file);
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
