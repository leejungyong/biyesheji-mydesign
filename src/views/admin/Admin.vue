<template>
  <div id="admin">
    <div class="admin_left">
      <div class="logo">
        <span>后台管理</span>
      </div>
      <!-- 顶部导航 -->
      <Menu
        :theme="theme"
        active-name="1"
        class="menu"
      >
        <router-link to="/admin/adminedit">
          <MenuItem name="1">
          <Icon type="ios-contact" />
          管理员管理
          </MenuItem>
        </router-link>
        <router-link to="/admin/useredit">
          <MenuItem name="2">
          <Icon type="ios-people" />
          用户管理
          </MenuItem>
        </router-link>
        <router-link to="/admin/category">
          <MenuItem name="4">
          <Icon type="ios-paper" />
          分类管理
          </MenuItem>
        </router-link>
        <router-link to="/admin/goods">
          <MenuItem name="5">
          <Icon type="ios-cube" />
          物品管理
          </MenuItem>
        </router-link>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-stats" />
            统计分析
          </template>
          <MenuGroup title="使用">
            <MenuItem name="3-1">交易记录</MenuItem>
            <MenuItem name="3-2">竞价记录</MenuItem>
          </MenuGroup>
        </Submenu>
      </Menu>
    </div>
    <br>
    <div class="admin_right">
      <div class="admin_right_top fr clearfix">
        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
        <span
          style="display:inline-block;   cursor: pointer;"
          @mouseover="enter"
          @mouseleave="leave"
        >
          <span style="margin:0 10px">{{nickName}}</span><br>
          <span
            class="logout fr clearfix"
            v-show="flag"
            @click="logOut"
          >退出</span>
        </span>

      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import "../../assets/css/common.css"
export default {
  data() {
    return {
      userName: '',
      theme: 'light',
      flag: false
    }
  },

  mounted() {
    this.checkLogin()
  },
  computed: {
    nickName() {
      return this.$store.state.nickName
    }
  },
  methods: {
    logOut() {
      this.$http.post('/admin/logout').then(response => {
        let res = response.data
        if (res.status == '0') {
          alert('退出成功')
          this.$router.push({ path: '/' })
        }
      })
      alert("退出")
    },
    checkLogin() {
      this.$http.get("/admin/checkLogin").then(response => {
        let res = response.data
        if (res.status == '0') {
          // this.nickName = res.result.userName
          this.$store.commit('updateUserInfo', res.result.userName)
        }
      })
    },
    enter() {
      this.flag = true
    },
    leave() {
      this.flag = false
    }
  }

}
</script>

<style lang="less">
html {
  height: 100%;
}
body {
  background: #f7f9fb;
}
#admin {
  .admin_left {
    top: 0;
    left: 0;
    height: 100%;
    position: fixed;
    border-right: 1px solid#dcdee2;
    background: white;
  }
  .admin_right {
    margin-left: 200px;
    padding: 0px 40px;
  }
  .admin_right_top {
    margin-right: 5px;
  }
  .logo {
    width: 200px;
    height: 100px;
    line-height: 100px;
    font-size: 20px;
    text-align: center;
  }
  .logout {
    display: inline-block;
    width: 50px;
    line-height: 25px;
    height: 25px;
    background: white;
    text-align: center;
    border-radius: 5px;
    margin-top: 5px;
    cursor: pointer;
  }
  .logout::after {
    background: red;
  }
  a {
    text-decoration: none;
    color: #515a6e;
  }

  .ivu-menu-light.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background: transparent;
  }
  .ivu-menu-light.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    background: transparent;
  }
  .menu {
    width: 200px !important;
  }
  .router-link-active {
    text-decoration: none !important;
  }
  .ivu-menu-vertical.ivu-menu-light:after {
    background: transparent;
  }
}
</style>
