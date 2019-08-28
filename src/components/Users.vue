<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 上面是面包屑导航 -->
    <template>
      <el-table :data="usersList" style="width: 100%">
        <el-table-column prop="role_name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180" ></el-table-column>
        <el-table-column  label="用户状态"  width="200" >
          <template v-slot:default="obj">
             <!-- element-ui组件在slot中, 添加 row, column, $index 和 store 这些数据
               这些数据都会以属性的方式, 添加到一个对象中, 可以通过 = 接收
          -->
          <!-- {{ obj.row.mg_state }} -->
          <!-- row 就是当前组件中遍历的这一条数据的对象信息 双向数据绑定的-->

              <el-switch
                v-model="obj.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="280">
           <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
           <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
           <el-button type="success" icon="el-icon-check" plain size="small">分配角色</el-button>
        </el-table-column>

      </el-table>
    </template>
    <!-- 分页 -->
     <div class="block">

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      usersList: [],
      total: 0
    }
  },
  created () {
    // 钩子函数  执行ajax
    this.getUserslist()
  },
  methods: {
    getUserslist () {
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          // 配置的传递的参数
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize

        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
        // 配置请求头, 如果不在请求头中配置 token, 拿不到数据的
      }).then(res => {
        // 成功拿到数据存起来, 准备渲染
        const { data, meta } = res.data
        // console.log(res)
        if (meta.status === 200) {
          this.usersList = data.users
          // console.log(data.users)
          this.total = data.total
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    handleCurrentChange (val) {
      // console.log(val)
      // 看文档 change事件，有回调参数
      this.pagenum = val
      // 回调参数当前页
      this.getUserslist()
    },
    handleSizeChange (val) {
      // 每页条数
      // 看文档 change事件，有回调参数

      this.pagesize = val
      this.getUserslist()
    }
  }
}
</script>

<style lang="scss">
.users {
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
  .el-pagination {
    margin-top:20px;
  }
}
</style>
