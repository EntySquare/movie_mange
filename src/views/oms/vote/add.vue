<template>
  <div class="add-goods">
    <el-card v-loading="loading">
      <h2>插入池子</h2>
      <el-form ref="FormRef" :model="Form" :rules="rules" label-width="105px">
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="Form.title" placeholder="输入标题" />
        </el-form-item>
        <el-form-item label="角色名A" prop="roleOne">
          <el-input v-model.trim="Form.roleOne" placeholder="输入角色名A" />
        </el-form-item>
        <el-form-item label="角色名B" prop="roleTwo">
          <el-input v-model.trim="Form.roleTwo" placeholder="输入角色名B" />
        </el-form-item>
        <el-form-item label="时间" prop="duration">
          <el-date-picker
            style="width: 100%"
            v-model="Form.endTime"
            :editable="false"
            type="datetime"
            placeholder="选择结束时间"
            clearable
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="初始底池金额" prop="initAmount">
          <el-input
            v-model.trim="Form.initAmount"
            type="number"
            placeholder="输入初始底池金额（U）"
          />
        </el-form-item>
      </el-form>

      <div class="btn-group">
        <el-button @click="$router.back()">返回</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { insertNewWahlPool } from "@/api/vote";
import store from "@/store";
import dayjs from "dayjs";
export default {
  name: "Add",
  data() {
    return {
      loading: false,
      authority: store.getters.authority, // 从store中获取authority
      Form: {
        title: "",
        roleOne: "",
        roleTwo: "",
        endTime: "",
        initAmount: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        roleOne: [
          { required: true, message: "请输入角色名A", trigger: "change" },
        ],
        roleTwo: [
          { required: true, message: "请输入角色名B", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: "change" },
        ],
        initAmount: [
          { required: true, message: "请输入初始底池金额", trigger: "change" },
        ],
      },
      pickerOptions: {
        //禁用当前日期之前的日期
        disabledDate(time) {
          //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
          return time.getTime() < Date.now();
        },
        disabledTime(time) {
          const now = new Date();
          if (this.isSameDay(time, now)) {
            return {
              // 禁用当前小时之前的所有小时
              disabledHours: () =>
                Array.from({ length: now.getHours() }, (_, i) => i),
              // 在当前小时中，禁用当前分钟之前的所有分钟
              disabledMinutes: (selectedHour) => {
                if (selectedHour === now.getHours()) {
                  return Array.from({ length: now.getMinutes() }, (_, i) => i);
                }
                return [];
              },
              // 如果需要，也可以禁用秒（但 Element UI 默认不显示秒）
              disabledSeconds: (selectedHour, selectedMinute) => {
                if (
                  selectedHour === now.getHours() &&
                  selectedMinute === now.getMinutes()
                ) {
                  return Array.from({ length: now.getSeconds() }, (_, i) => i);
                }
                return [];
              },
            };
          }
          return {};
        },
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
        const now = dayjs();
        const end = dayjs(this.Form.endTime);

        if (!end.isValid() || end.isBefore(now)) {
          console.error("结束时间无效");
          return;
        }

        // 计算 duration（秒）
        const duration = end.diff(now, "second");

        this.loading = true;
        insertNewWahlPool({
          title: this.Form.title,
          roleOne: this.Form.roleOne,
          roleTwo: this.Form.roleTwo,
          duration: duration,
          initAmount: (Number(this.Form.initAmount) * 10 ** 18).toString(),
        })
          .then(() => {
            this.$message.success("池子创建成功");
            this.$refs.FormRef.resetFields(); // 清空表单、
            //跳转到列表页面
            this.$router.push({ path: "/vote" });
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
  max-width: 600px;
  margin: 20px auto;
}
.btn-group {
  display: flex;
  justify-content: space-between;
}
</style>
<style >
.el-picker-panel__footer .el-button--text {
  display: none !important;
}
</style>
