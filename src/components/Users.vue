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
      <el-button type="success" plain class="addBtn" @click="dialogVisible = true" >添加用户</el-button>
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
            <!-- 修改功能 -->
           <el-button type="primary" icon="el-icon-edit" plain size="small" @click="editBox(obj.row)"></el-button>
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

  <!-- 这里是添加用户对话框 -->
      <el-dialog
      @closed="dialogClose"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%">
      <!-- 此处为body部分，表单 -->
      <el-form status-icon ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
        <el-input placeholder="请输入手机号码" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </span>
    </el-dialog>
  <!-- 这里是修改用户信息框 -->
  <el-dialog
      title="编辑用户信息"
      :visible.sync="editVisible"
      width="40%">
 <el-form status-icon ref="editForm" :rules="rules" :model="editForm" label-width="80px">
    <el-form-item label="用户名">
        <el-tag type="info">{{ editForm.username }}</el-tag>
     </el-form-item>
    <el-form-item label="邮箱" prop="email">
    <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
    </el-form-item>

    <el-form-item label="手机" prop="mobile">
    <el-input placeholder="请输入手机号码" v-model="editForm.mobile"></el-input>
    </el-form-item>

 </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureEdit">确 定</el-button>
    </span>
  </el-dialog>
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
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: '666'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['change', 'blur'] },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['change', 'blur'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    // 钩子函数  执行ajax
    this.getUserslist()
  },
  methods: {
    editBox (row) {
      console.log(row)
      this.editVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.mobile = row.mobile
      this.editForm.email = row.email
    },
    async sureEdit () {
      // 点击sure确定修改发送ajax
      // 先校验再发送
      try {
        await this.$refs.editForm.validate()
        // 验证也要等结果！！
        const { id, email, mobile } = this.editForm
        console.log(email, mobile)
        const { meta } = await this.$axios.put(`users/${id}`, {
          email, mobile
        })
        if (meta.status === 200) {
          this.$message({
            message: '修改信息成功！',
            type: 'success'
          })
          // 成功就关闭模态框
          this.editVisible = false
          this.getUserslist()
        } else {
          this.$message({
            message: meta.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    dialogClose () {
      // 对话框关闭就重置表单
      this.$refs.form.resetFields()
      // $refs是找到所有的ref 后面需要加上具体的name form
    },
    async sureAdd () {
      try {
        await this.$refs.form.validate()
        // 发送ajax
        const { meta } = await this.$axios.post('users', this.form)
        console.log(meta)
        if (meta.status === 201) {
          this.$message({
            message: '创建用户成功！',
            type: 'success'
          })
          // 创建成功并重新渲染,关闭模态框
          this.dialogVisible = false
          // 跳转到最后一页，因为添加的内容在最后
          // 每次添加总页数加1 并且用总页数除以每页页数等于当前页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserslist()
        } else {
          this.$message({
            message: meta.msg,
            type: 'error'
          })
        }
      } catch (e) {
        // 如果有错误走到这里
        console.log(e)
      }
    },
    serchBtn () {
      // 依据query来发送ajax
      this.getUserslist()
    },
    async openDel (id) {
      // 手写优化版的点击删除,这里没有返回值，所以不用接受
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          type: 'warning'
        })
        // 到这里就点击确定，发送ajax
        const { meta } = await this.$axios.delete(`users/${id}`)
        console.log('点击了确定')
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
      } catch (e) {
        console.log(e)
        console.log('点击了取消')
      }
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   // 到了这里就是确定删除，那就发ajax
      //   this.$axios.delete(`users/${id}`).then(res => {
      //     console.log(res)
      //     const { meta } = res
      //     if (meta.status === 200) {
      //       // if判断，如果页数不是最后一页并且当前页只剩下一条数据，那么就--
      //       if (this.usersList.length === 1 && this.pagenum > 1) {
      //         this.pagenum--
      //       }
      //       // 如果请求成功就通知删除成功
      //       this.$message.success(meta.msg)
      //       // 重新渲染
      //       this.getUserslist()
      //     } else {
      //       this.$message.error(meta.msg)
      //     // 如果没有删除成功也通知错误
      //     }
      //     // 重新渲染
      //   }).catch((err) => {
      //     console.log(666)
      //     console.log(err)
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    },
    // change是修改状态
    async changeState (row) {
      // 需要传id 和 state
      // async和await优化成功
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: meta.msg,
          type: 'error'
        })
      }
    },
    async getUserslist () {
      const res = await this.$axios.get('users', {
        params: {
          // 配置的传递的参数
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
        // 配置请求头, 如果不在请求头中配置 token, 拿不到数据的
      })
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
