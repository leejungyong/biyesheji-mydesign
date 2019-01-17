<template>
  <div id="home">
    <div class="home_top">
      <div class="navbar"></div>
      <Login class="fr clearfix" />
    </div>
    <div class="release_goods"></div>
    <div class="navigition"></div>
    <div class="item_list"></div>
  </div>
</template>

<script>
import Login from '../components/Login'
import '../assets/css/common.css'
export default {
  components: {
    Login
  }

}
</script>

<style lang="less">
#home {
  .home_top {
    height: 350px;
    width: 100%;
    margin-bottom: 30px;
    background-image: url("../assets/images/banner.jpg");
  }
}
</style>
