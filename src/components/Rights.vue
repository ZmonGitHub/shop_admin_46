<template>
<div class="rights">
      <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 这里是table表格 -->
    <template>
  <el-table
    ref="singleTable"
    :data="rightsList"
    highlight-current-row
    style="width: 100%">
    <el-table-column
      type="index"
      width="50"
      >
    </el-table-column>
    <el-table-column
      property="date"
      label="权限名称"
      prop="authName"
      >
    </el-table-column>
    <el-table-column
      property="name"
      label="路径"
      prop="path"
      >
    </el-table-column>
    <el-table-column
      label="层级">
    <template v-slot:default="{row}">
      <!-- obj-row 参考element组件库 -->
      <p v-if="row.level==='0'">一级</p>
      <p v-if="row.level==='1'">二级</p>
      <p v-if="row.level==='2'">三级</p>
    </template>
    </el-table-column>
  </el-table>
</template>
</div>
</template>

<script>
export default {
  data () {
    return {
      // rightsList是数据
      rightsList: []
    }
  },
  created () {
    // 钩子函数，进来就渲染页面
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
    // 发送ajax
      console.log(66)
      const { data, meta } = await this.$axios.get('rights/list')
      console.log(data, meta)
      if (meta.status === 200) {
        this.rightsList = data
        console.log(data)
      } else {
        this.message.error(meta.msg)
      }
    }
  }

}
</script>

<style>

</style>
