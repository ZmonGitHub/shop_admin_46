<template>
  <div class="goods">
    <el-button type="success" plain @click="goodsAdd">添加商品</el-button>
    <el-table style="width: 100%" :data="goodsList" >
       <el-table-column
        type="index"
        >
      </el-table-column>
       <el-table-column
        label="商品名称"
        prop="goods_name"
        >
      </el-table-column>
       <el-table-column
        prop="goods_price"
        label="商品价格"
        >
      </el-table-column>
       <el-table-column
        prop="goods_weight"
        label="商品重量"
        >
      </el-table-column>
       <el-table-column

        label="创建时间"
        >
        <template v-slot:default="{row}">
          {{ row.add_time | time }}
        </template>
      </el-table-column>
       <el-table-column
        label="操作" >
         <el-button type="primary" icon="el-icon-edit" plain size="small" ></el-button>
         <el-button type="danger" icon="el-icon-delete" plain size="small" ></el-button>
      </el-table-column>
    </el-table>
    <!-- 来个分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    goodsAdd () {
      // console.log(66)
      // 点击跳转到goodsadd,不是通过路由跳转的，需要自己携带头，
      this.$router.push('/goodsAdd')
      // 这个用router整个路由，不是当前路由
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    async getGoodsList () {
      // 发送ajax拿到数据列表
      const { data, meta } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(data)
      // 判断
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods {
    .el-button {
      margin-bottom:10px;
    }
  }
</style>
