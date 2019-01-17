<template>
  <div id="login_box">
    <h2>Login to your account</h2>
    <input
      type="text"
      placeholder="用户名"
      v-model="userName"
    ><br><br>
    <input
      type="password"
      id=""
      placeholder="密码"
      v-model="userPwd"
    ><br><br>

    <button
      @click="login"
      class="loginbt"
    >登录</button><br>
    <!-- <button @click="register">注册</button> -->

    <span v-show="tipError">用户名或密码错误 </span>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      userName: '',
      userPwd: '',
      tipError: false,


    }
  },
  computed: {
    nickName() {
      return this.$store.state.nickName
    }
  },
  mounted() {
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      this.$http.get("/admin/checkLogin").then(response => {
        let res = response.data
        if (res.status == '0') {
          // this.nickName = res.result.userName
          this.$store.commit('updateUserInfo', res.result.userName)
        }
      })
    },
    register() { },
    login() {
      axios.post('/admin/login', {
        userName: this.userName,
        userPwd: this.userPwd
      }).then((response => {
        let res = response.data;
        if (res.status == '0') {
          this.tipError = false
          alert('登录成功')
          this.$router.push({ name: 'Admin', params: { userName: res.result.userName } })
        } else {
          this.tipError = true
        }
      }))
    }
  }

}
</script>

<style lang='less'>
#login_box {
  background: white;
  width: 340px;
  height: 270px;
  padding: 35px 40px;
  margin-right: 80px;
  border-radius: 4px;
  input {
    outline: none;
    width: 240px;
    height: 35px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    padding: 10px 15px;
  }
  h2 {
    margin: 0 0 20px;
    color: #558979;
    font-size: 18px;
    font-weight: 400;
    line-height: 1;
  }
  .loginbt {
    width: 240px;
    height: 35px;
    background: #558979;
    border: 0;
    color: white;
  }
}
</style>
