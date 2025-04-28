<template>
  <div class="add-goods">
    <el-card v-loading="loading">
      <h2>插入池子</h2>
      <el-form ref="FormRef" :model="Form" :rules="rules" label-width="105px">
        <el-form-item label="hash" prop="hash">
          <el-input v-model.trim="Form.hash" placeholder="输入hash" />
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-model.trim="Form.account" placeholder="输入账户" />
        </el-form-item>
      </el-form>
      <!-- hash 和 account，都是 string -->
      <div class="btn-group">
        <el-button @click="$router.back()">返回</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addNewMintNFT } from "@/api/nft";
import store from "@/store";
export default {
  name: "Add",
  data() {
    return {
      loading: false,
      authority: store.getters.authority, // 从store中获取authority
      Form: {
        hash: "",
        account: "",
      },
      rules: {
        hash: [{ required: true, message: "请输入hash", trigger: "change" }],
        account: [{ required: true, message: "请输入账户", trigger: "change" }],
      },
    };
  },
  methods: {
    submit() {
      if (this.authority !== "all") {
        this.$message.error("无权限操作");
        return;
      }
      this.$refs.FormRef.validate((valid) => {
        if (!valid) {
          this.$message.error("请填写完整信息");
          return;
        }

        this.loading = true;
        addNewMintNFT({
          hash: this.Form.hash,
          account: this.Form.account,
        })
          .then(() => {
            this.$message.success("池子创建成功");
            this.$refs.FormRef.resetFields(); // 清空表单、
            //跳转到列表页面
            this.$router.push({ path: "/nft" });
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
  margin-top: 60px;
}
</style>
<style >
.el-picker-panel__footer .el-button--text {
  display: none !important;
}
</style>
