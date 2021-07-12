<template>
  <el-container class='home-container'>
    <!--头部区域-->
    <el-header>
      <div class='header_box'>
        <img alt='' src='../assets/logo.png'>
        <span>电商后台管理系统</span>
      </div>

      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' :'200px'">
        <div class='toggle-button' @click='toggleCollapse'>|||</div>
        <!--侧边栏菜单区-->
        <el-menu
          :uniqueOpened='true'
          active-text-color='#339fff'
          background-color='#313743'
          text-color='#fff'
          :unique-opened = 'true'
          :collapse = 'isCollapse'
          :collapse-transition = 'false'
          router
          :default-active='activePath'>
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for='item in menulist' :key='item.id'>
            <!--一级菜单的模板区域-->
            <template #title>
              <!--图标-->
              <i :class='iconObj[item.id]'></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="'/' + subItem.path" v-for='subItem in item.children' :key='subItem.id' @click="saveNavState('/' + subItem.path)">
              <template #title>
                <!--图标-->
                <i class='el-icon-menu'></i>
                <!--文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',

  data() {
    return {
      menulist: [],
      iconObj: {
        125: 'el-icon-user',
        103: 'el-icon-setting',
        101: 'el-icon-goods',
        102: 'el-icon-tickets',
        145: 'el-icon-data-line'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },

  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
  background-color: #339fff;
}

.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.header_box {
  img {
    height: 50px;
  }
}

.el-aside {
  background-color: #313743;
  .el-menu{
    border-right: none;
  }
}

.el-main {
  background-color: #e9edf1;
}

.toggle-button{
  background-color: #475168;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
