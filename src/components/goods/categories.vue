<template>
  <div class="categories">
    <el-button type="success" plain class="mg-b10" @click="showAdd">
      添加分类
    </el-button>

  <!-- 添加对话框 -->
  <el-dialog

    title="添加分类"
    :visible.sync="addVisible"
    width="30%"
    >
    <!-- <span>这是一段信息</span> -->
    <el-form status-icon ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类名称" v-model="addForm.cat_name" ></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <div class="block">
            <!-- 级联选择器 -->
            <el-cascader
              :options="options"
              :props="props"
              v-model="addForm.cat_pid"
              clearable></el-cascader>
          </div>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addVisible = false">取 消</el-button>
      <el-button type="primary" @click="sureAdd">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 表格 -->
      <el-table
       v-loading="flag"
         row-key="cat_id"
        :data="cateList"
        style="width: 100%">
<!-- 表格是可以直接使用data里面的数据的 -->
        <el-table-column
          prop="cat_name"
          label="分类名称"
          >
        </el-table-column>
        <el-table-column

          label="是否有效"
          >
          <template v-slot:default="{row}">
            {{ row.cat_deleted  ? '否' : '是' }}
            <!-- row只能在table中舒勇，并且table已经有数据的 -->
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_level"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作">
          <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
        </el-table-column>
      </el-table>
  <!-- 分页 -->
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="form.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 这个div是结尾div -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      addForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      cateList: [],
      form: {
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      flag: false,
      addVisible: false,
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: ['blur', 'change'] }
        ]
      },
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async sureAdd () {
      try {
        // console.log(66)
      // 发送ajax，创建数据后，关闭对话框。重新渲染数据
        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0, // id只要最后一项就行了如果没有选择，那就是undefind所以给个默认值0
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length
        })
        // console.log(data)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addVisible = false
          this.getCateList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAdd () {
      this.addVisible = true
      // 发送ajax拿到二级分类列表
      const { meta, data } = await this.$axios.get('categories?type=2')
      // console.log(res)
      // 判断，成功就把数据给options
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.form.pagesize = val
      this.getCateList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.form.pagenum = val
      this.getCateList()
    },
    async getCateList () {
      this.flag = true
      const { meta, data } = await this.$axios.get('categories?type=3', {
        params: {
          pagenum: this.form.pagenum,
          pagesize: this.form.pagesize
        }
      })
      // console.log(data)
      if (meta.status === 200) {
        this.cateList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      this.flag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.categories{
  .mg-b10 {
    margin-bottom: 10px;
  }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>
