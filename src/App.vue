<template>
  <div id="app">
    <router-view/>
    <!-- 路由的出口 -->
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,body,#app {
  height: 100%;
  width:100%;

}
// 禁止选中页面，复制
*{
-moz-user-select: -moz-none;
-moz-user-select: none;
-o-user-select:none;
-khtml-user-select:none;
-webkit-user-select:none;
-ms-user-select:none;
user-select:none;
}
#app .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
}
</style>
