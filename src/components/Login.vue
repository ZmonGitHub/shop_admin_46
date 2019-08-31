<template>
  <div class="login">
    <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px" res="form">
      <el-form-item label="用户名" prop="username">
        <el-input @keyup.enter.native="login" v-model="form.username" placeholder="请输入用户名"></el-input>
        <!-- .native是相当原生事件，监听子组件根元素事件 -->
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input @keyup.enter.native="login" type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset" class="reset">重置</el-button>
      </el-form-item>
      <img src="../assets/avatar.jpg" alt />
    </el-form>

    <!-- 再来俩按钮 -->
  </div>
</template>

<script>
// 在使用ajax的页面引入 axios

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        // rules表单验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.post('login', this.form)
        // 你用到this的时候一定要思考this指向！
        const { meta, data } = res
        if (meta.status !== 200) {
          this.$message.error(meta.msg)
        } else {
          this.$message({
            message: '登录成功',
            type: 'success'
            // 登录成功跳转到Index
          })
          // 导航守卫,第一步在跳转页面前存token
          localStorage.setItem('token', data.token)
          // data.token是服务器返回的一个token令牌，需要手动存到浏览器localstorage中，在路由router哪里进行判断看登录者是否有token
          this.$router.push('/index')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  background-color: #2d434c;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .el-form {
    background-color: #fff;
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    margin: 0 auto;
    margin-top: 200px;
    border-radius: 20px;
    position: relative;

    img {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -60%);
      border-radius: 50%;
      border: 5px solid #fff;
    }
    .reset {
      margin-left:90px;
    }
  }
}
</style>
