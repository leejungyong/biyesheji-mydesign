import Vue from 'vue'
import Router from 'vue-router'

import Admin from '@/views/admin/Admin'
import admin_edit from '@/views/admin/admin_edit'
import user_edit from '@/views/admin/user_edit'
import category from '@/views/admin/category'
import goods from '@/views/admin/goods'
import goods_add from '@/views/admin/goods_add'
import goods_edit from '@/views/admin/goods_edit'

import GoodsList from '@/views/GoodsList'
import Home from '@/views/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/admin',
      name: 'Admin',
      redirect: '/admin/adminedit',
      component: Admin,

      children: [
        {
          path: 'adminedit',
          component: admin_edit
        },
        {
          path: 'useredit',
          component: user_edit
        },
        {
          path: 'category',
          component: category
        },
        {
          path: 'goods',
          component: goods
        },
        {
          path: 'goods_add',
          name: 'goods_add',
          component: goods_add
        },
        {
          path: 'goods_edit',
          name: 'goods_edit',
          component: goods_edit
        }
      ]
    }
  ]
})
