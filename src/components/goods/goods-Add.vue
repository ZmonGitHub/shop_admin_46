<template>
  <div class="goods-Add">

    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <!-- 这个是tab栏 -->
      <el-tabs v-model="tabvalue" @tab-click="handleClick" :tab-position="tabPosition" >
          <el-tab-pane name="0" label="基本信息">
            <!-- form表单 -->
            <el-form ref="form" :model="form" >
              <el-form-item label="商品名称" label-width="80px">
                 <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
              </el-form-item>
               <el-form-item label="商品价格" label-width="80px">
                 <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
              </el-form-item>
               <el-form-item label="商品重量" label-width="80px">
                 <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
              </el-form-item>
               <el-form-item label="商品数量" label-width="80px">
                 <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
              </el-form-item>
               <el-form-item label="商品分类" label-width="80px">
                <!-- 级联选择器 -->
                <div class="block">
                  <el-cascader
                    v-model="form.goods_cat"
                    :props="props"
                    :options="options"
                    @change="handleChange"></el-cascader>
                </div>
              </el-form-item>
            </el-form>
              <el-button type="primary" @click="next">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品图片">
            <!-- action图片上传路径，需要拼全，因为不是走的路由,name是上传文件字段名，后台要的， -->
            <el-upload
              multiple
              action="http://localhost:8888/api/private/v1/upload"
              list-type="picture-card"
              name="file"
              :headers="headers"
              :on-success="handleSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <el-button class="mgt10" type="primary" @click="next">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品内容">
            <quill-editor v-model="form.goods_introduce"
                          ref="myQuillEditor"
                          :options="editorOption">
            </quill-editor>
             <el-button  class="mgt10" type="primary" @click="sureAdd">
                确认添加
              </el-button>
          </el-tab-pane>

        </el-tabs>

  </div>
</template>

<script>
export default {
  data () {
    return {
      content: '<h2>I am Example</h2>',
      editorOption: {
        // some quill options
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      active: 0,
      tabPosition: 'left',
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      form: {
        // 这个是 级联选择器传过来的分类id是个数组
        goods_cat: [],
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
        // pics是数组存着对象，里面放着图片的临时路径
      },
      tabvalue: 0,
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async sureAdd () {
      // console.log(66)
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      // console.log(data)
      if (meta.status === 201) {
        // 通知创建成功，跳转页面
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
      // console.log(this.form.goods_cat.join(',')) 把数组变成了用逗号分隔的字符串
    },
    onEditorChange ({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
      this.content = html
    },
    handleSuccess (response, file, fileList) {
      // 文件上传成功时的钩子
      const { data, meta } = response
      // console.log(response)
      if (meta.status === 200) {
        this.form.pics.push({ pic: data.tmp_path })
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      const path = file.response.data.tmp_path // 拿到删除的图片的路径
      // file 删除的文件信息，fileList 是删除后的数组长度
      // 然后循环遍历pic数组 filter过滤保留不是这个删除的路径的
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
    },
    handlePictureCardPreview (file) {
      // console.log(file) 图片的信息
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange (value) {
      console.log(value)
      // 级联选择器的点击事件
    },
    next () {
      this.active++
      this.tabvalue = this.active + ''
      // 绑定值，选中选项卡的 string
    },
    handleClick (tab, event) {
      // tab标签页的点击事件
      // console.log(tab)
      this.active = +tab.index
    },
    async getGoodsList () {
      // 发送ajax
      const { data, meta } = await this.$axios.get('categories?type=3')
      // console.log(res)
      if (meta.status === 200) {
        // this.$message.success(meta.msg)
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  }
}
</script>

<style lang="scss" scoped>
.goods-Add {
  .mgt10 {
    margin-top:10px;
  }
  .quill-editor{
    background-color: #fff;
    // height:300px;
    ::v-deep .ql-toolbar.ql-snow + .ql-container.ql-snow {
      height: 250px;
    }
  }
}
</style>
