<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"
    ></hamburger>
    <div class="avatar-container" @click="logout">
      <!-- <img class="user-avatar" :src="avatar" /> -->
      <svg
        t="1744088800990"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3622"
        id="mx_n_1744088800991"
        width="24"
        height="24"
      >
        <path
          d="M533.333333 64a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H170.666667v725.333334h362.666666a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H170.666667a85.333333 85.333333 0 0 1-85.226667-81.066667L85.333333 874.666667V149.333333a85.333333 85.333333 0 0 1 81.066667-85.226666L170.666667 64h362.666666z m194.581334 219.584l183.168 183.168a64 64 0 0 1 2.88 87.424l-2.88 3.072-183.168 183.168a21.333333 21.333333 0 0 1-30.165334 0l-30.165333-30.165333a21.333333 21.333333 0 0 1 0-30.165334L792.96 554.666667H362.666667a21.333333 21.333333 0 0 1-21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333334-21.333334h430.293333l-125.376-125.418666a21.333333 21.333333 0 0 1 0-30.165334l30.165333-30.165333a21.333333 21.333333 0 0 1 30.165334 0z"
          fill="#2c2c2c"
          p-id="3623"
        ></path>
      </svg>
    </div>

    <breadcrumb></breadcrumb>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$confirm(`是否退出登录？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消",
          });
        });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    width: 50px;
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>

