<template>
  <div class="roles">
          <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 这是按钮 -->
    <el-button type="success" plain class="marB10" @click="showAddRoleBox">添加角色</el-button>
    <!-- 这个是表格 -->
     <el-table
      :data="data"
      style="width: 100%">
       <el-table-column
        type="expand">
        <!-- 这个地方是树状结构 -->
         <template v-slot:default="{ row }">
           <!-- row拿到返回的数据 -->

           <el-row class="marB10" v-for="l1 in row.children" :key="l1.id">
             <!-- 左边4份，一级分类 -->
              <el-col :span="4">
                <el-tag @close="delAuthName(row,l1.id)" closable> {{ l1.authName }}</el-tag><i class="el-icon-arrow-right"></i>
                </el-col>
              <!-- 右边20份 -->
              <el-col :span="20">
                <!-- 20 col里面有多行 -->
                  <el-row class="marB10" v-for="l2 in l1.children" :key="l2.id">
                    <!-- 这里是第一行 -->
                    <el-col :span="4">
                      <!-- 这个是20份里面的4份，二级分类 -->
                      <el-tag @close="delAuthName(row,l2.id)" closable type="success"> {{ l2.authName }}</el-tag><i class="el-icon-arrow-right"></i>
                    </el-col>
                    <!-- 这里是20份里面的20份 -->
                     <el-col :span="20">
                      <!-- 这个是三级分类 -->
                      <el-tag @close="delAuthName(row,l3.id)" closable type="warning"  v-for="l3 in l2.children" :key="l3.id"> {{ l3.authName }} </el-tag>
                    </el-col>
                  </el-row>

              </el-col>
            </el-row>

        </template>
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        >
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template v-slot:default="{ row }">
        <el-button type="primary" icon="el-icon-edit" plain size="small" @click="showEdit(row)"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="small" @click="showDelRole(row.id)"></el-button>
        <el-button type="success" icon="el-icon-check" plain  size="small" @click="showDistribute(row)" >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="distribute"
      width="40%"
      >
      <el-tree default-expand-all ref="tree" show-checkbox node-key="id" :data="tree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distribute = false">取 消</el-button>
        <el-button type="primary" @click="sureDistribute" >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 下面是添加用户的对话框 -->
    <el-dialog
    @close="closeDialog"
      :title="dialogTitle"
      :visible.sync="AddRoleBox"
      width="30%">
      <!-- <span>这是一段信息</span> -->
      <el-form :rules="rules" ref="form" :model="form" label-width="80px" >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="form.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleBox = false">取 消</el-button>
        <el-button type="primary" @click="sureAddRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 这个div是根标签 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogTitle: '',
      form: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      roleld: '',
      data: [],
      tableData: [],
      distribute: false,
      tree: [],
      AddRoleBox: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }

        ]
      }
    }
  },
  created () {
    // 到这个页面就发送ajax拿表格数据
    this.getRolesList()
  },
  methods: {
    showAddRoleBox () {
      this.dialogTitle = '添加角色'
      this.AddRoleBox = true
    },
    closeDialog () {
      // 将表单的内容和状态, 都重置为初始状态(是对话框第一次展示状态)
      this.$refs.form.resetFields()
      this.form.id = ''
      this.form.roleDesc = ''
    },
    showEdit (row) {
      // 修改标题
      this.dialogTitle = '修改角色'
      this.AddRoleBox = true // 将对话框展示出来, vue中的dom更新是异步的, 不会立刻更新
      // 在这里完成数据回显
      this.$nextTick(() => {
        // 进行数据的回显
        this.form.id = row.id
        this.form.roleDesc = row.roleDesc
        this.form.roleName = row.roleName
      })
    },
    async sureAddRole () {
      // console.log('黄河')
      // 点击确定校验数据，添加角色，发送ajax，重新渲染列表,关闭对话框，提示创建成功
      try {
        await this.$refs.form.validate()
        // console.log(66)
        // 判断title是谁
        const isAdd = this.dialogTitle === '添加角色'
        // console.log(isAdd)
        // 三元运算符 如果为true 走第一个 false走第二个
        const url = isAdd ? 'roles' : `roles/${this.form.id}`
        const method = isAdd ? 'post' : 'put'

        const { meta } = await this.$axios[method](url, this.form)
        // console.log(meta)
        if (meta.status === 201 || meta.status === 200) {
          this.getRolesList()
          this.AddRoleBox = false
          this.$message.success('操作成功')
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showDelRole (id) {
      console.log(id)
      // this.roleld = id
      try {
        await this.$confirm('此操作将删除该角色, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        // 能到这就说明删除成功了
        // console.log(res)
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新渲染
          this.getRolesList()
        } else {
          this.$message({
            type: 'error',
            message: meta.msg
          })
        }
        console.log('这里是确定')
      } catch (e) {
        console.log(e)
        console.log('这里是取消')
      }

      // .then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    },
    async sureDistribute () {
      // 点击获取全选的id和半选中的id
      const allId = this.$refs.tree.getCheckedKeys()
      const half = this.$refs.tree.getHalfCheckedKeys()
      // console.log(allId)
      const rids = [...allId, ...half].join(',')
      // 后台要求是以逗号隔开的权限id列表
      // console.log(rids)
      // 发送ajax更新数据，然后渲染
      // console.log(row)
      const { meta } = await this.$axios.post(`roles/${this.roleld}/rights`, { rids })
      // console.log(res)
      if (meta.status === 200) {
        // 200就等于更新数据成功，重新渲染，关掉对话框，提示更新成功
        this.getRolesList()
        this.distribute = false
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleNodeClick (data) {
      console.log(data)
    },
    async showDistribute (row) {
      this.distribute = true
      // 显示盒子的时候就发送ajax拿到数据
      const res = await this.$axios.get('rights/tree')
      console.log(res)
      this.tree = res.data
      // 需要回显点亮该角色有的权限
      const ids = []
      // console.log(row.id)
      this.roleld = row.id
      // 从一级权限中找到所有的二级权限，再找三级权限的id
      row.children.forEach(l1 => {
        // 所有一级权限
        l1.children.forEach(l2 => {
          // 所有2级权限
          l2.children.forEach(l3 => {
            ids.push(l3.id)
            // 把每一个3级权限的id都存到一个数组中，一起去点亮
          })
        })
      })
      // 通过key进行设置
      this.$refs.tree.setCheckedKeys(ids)
    },
    async delAuthName (row, id) {
      // row.id就是角色id
      // console.log(row) row就是 data {return }数据里面的 data
      const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${id}`)
      // console.log(data, meta)// data是删除后的新数据数组
      if (meta.status === 200) {
      // 发送ajax删除，删除完只渲染当前children部分
      // row是当前页面的row 的 children换成 data里面的最新数值就可以了，双向数据绑定
        row.children = data
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
      // row.children是数据
    },
    async getRolesList () {
      // 发送ajax拿数据
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        // console.log(data)
        this.data = data
        // 就渲染
      } else {
        console.log(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.roles {
  .marB10 {
    margin-bottom: 10px;
  }
  .el-tag{
    margin-right:5px;
    margin-bottom: 5px;
  }
}
</style>
