<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 上面是面包屑导航 -->
    <!-- 这里是搜索关键字 -->
      <div class="serch">
      <el-input placeholder="请输入搜索关键字" v-model="query" class="inputSerch">
      <el-button slot="append" icon="el-icon-search" @click="serchBtn"></el-button>
      </el-input>
      <el-button type="success" plain class="addBtn" >添加用户</el-button>
      </div>
    <!-- 下面是表格 -->

      <el-table :data="usersList" style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180" ></el-table-column>
        <el-table-column  label="用户状态"  width="200"  >
          <template v-slot:default="obj">
             <!-- element-ui组件在slot中, 添加 row, column, $index 和 store 这些数据
               这些数据都会以属性的方式, 添加到一个对象中, 可以通过 = 接收
          -->
          <!-- {{ obj.row.mg_state }} -->
          <!-- row 就是当前组件中遍历的这一条数据的对象信息 双向数据绑定的-->

              <el-switch
                @change="changeState(obj.row)"
                v-model="obj.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="280">
          <template  v-slot:default="obj">
           <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
           <el-button type="danger" icon="el-icon-delete" plain size="small"  @click="openDel(obj.row.id)" ></el-button>
           <el-button type="success" icon="el-icon-check" plain size="small">分配角色</el-button>
           </template>
        </el-table-column>

      </el-table>

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
    serchBtn () {
      // 依据query来发送ajax
      this.getUserslist()
    },
    openDel (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 到了这里就是确定删除，那就发ajax
        this.$axios.delete(`users/${id}`).then(res => {
          console.log(res)
          const { meta } = res
          if (meta.status === 200) {
            // if判断，如果页数不是最后一页并且当前页只剩下一条数据，那么就--
            if (this.usersList.length === 1 && this.pagenum > 1) {
              this.pagenum--
            }
            // 如果请求成功就通知删除成功
            this.$message.success(meta.msg)
            // 重新渲染
            this.getUserslist()
          } else {
            this.$message.error(meta.msg)
          // 如果没有删除成功也通知错误
          }
          // 重新渲染
        }).catch((err) => {
          console.log(666)
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // change是修改状态
    changeState (row) {
      // 需要传id 和 state

      this.$axios.put(`users/${row.id}/state/${row.mg_state}`).then((res) => {
        console.log(res)
        const { meta } = res
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        }
      }).catch((e) => {
        this.$message({
          message: e,
          type: 'error'
        })
      })
    },
    getUserslist () {
      this.$axios.get('users', {
        params: {
          // 配置的传递的参数
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize

        }

        // 配置请求头, 如果不在请求头中配置 token, 拿不到数据的
      }).then(res => {
        // 成功拿到数据存起来, 准备渲染
        const { data, meta } = res
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
    margin-bottom: 10px;
  }
  .el-pagination {
    margin-top:20px;
  }
  .serch {
    margin-bottom: 10px;
    .inputSerch {
    width:300px;
  }
    .addBtn {
      margin-left:20px;
    }
  }

}
</style>
