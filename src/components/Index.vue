<template>
  <div class="index">

  <el-container>
    <el-header>
      <div class="login"><img src="../assets/logo1.png" alt=""></div>

      <div class="title"><h1>电商后台管理系统</h1></div>
      <div class="welcome"><span>欢迎光临~</span><a href="javascript:;" class="logout" @click="loginout">退出</a> </div>

    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 给Menu开启router模式，会以path进行路由跳转 -->
    <el-menu router unique-opened
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <!-- 第一个 -->
      <el-submenu :index="item.path" v-for="item in leftList" :key="item.id">
        <!-- 一级权限好了 -->
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级权限 -->
        <template slot="title"></template>
        <el-menu-item :index="l2.path" v-for="l2 in item.children" :key="l2.id"><i class="el-icon-menu"></i> {{ l2.authName }} </el-menu-item>

      </el-submenu>

    </el-menu>

      </el-aside>
      <el-main>
       <!-- 此处填写main内容 -->
      <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      leftList: []
    }
  },
  async created () {
    // 拿到左侧菜单列表
    const res = await this.$axios.get('menus')
    // console.log(res)
    this.leftList = res.data
  },
  methods: {
    loginout () {
      // console.log(2)
      this.$confirm('此操作将退出当前登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('token')
        // 删除并跳转到Login
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  computed: {
    defaultActive () {
      // console.log(this.$route)
      return this.$route.path.slice(1).split('-')[0]
      // slice截取 从 下标1开始,split以-分割，取第一项goods-Add，那到Goods，就可以也默认高亮
    }
  }
}
</script>

<style lang="scss" scoped>
// scoped 范围
.index {
  height: 100%;
  .el-container {
  height: 100%;
    .el-header {
  display: flex;

      background-color: #d8d8d8;
      .login {
        width:180px;
        img {
          height: 40px;
        }
        padding: 10px;
      }
      .title {
        flex:1;
        text-align: center;
        overflow: hidden;
        h1 {
        height: 60px;
        line-height: 60px;
      }
      }

      .welcome {
        width:180px;
        text-align: right;
      }
      span {
        font-weight: 700;
        height: 60px;
        line-height: 60px;
      }
      .logout {
        color:orange;
      }
    }
    .el-container {
     height: 100%;

      .el-aside {
        background-color: #545c64;
      }
      .el-main {
        background-color: #ecf0f1;
      }
    }
    .el-aside {
      width:100%;
      .el-menu {
    border-right: none;
    }
    }
  }
}
</style>
