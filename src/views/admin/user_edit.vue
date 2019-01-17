<template>
  <div id="userList">
    <div class="title">用户列表</div><br>
    <Button
      type="primary"
      shape="circle"
      size="large"
      @click.native="openModal"
    >
      <Icon type="md-trash" />
      批量删除</Button>
    <div class="table_box">
      <Table
        border
        :columns="columns"
        :data="data"
        @on-selection-change="getSelect"
      ></Table>
    </div><br>
    <div class="page_box">
      <Page
        :total="pageParams.total"
        :current='pageParams.page'
        :page-size='pageParams.pageSize'
        @on-change="pageChange"
        show-total
      />
    </div>
    <Modal
      v-model="edit_modal"
      title="编辑"
      :loading="loading"
      @on-ok="saveEdit"
    >
      <span class="text">用户名</span>
      <Input
        v-model="currentUser.userName"
        placeholder="用户名"
        style="width: 150px"
      />
      <br><br>
      <span class="text">密码</span>
      <Input
        v-model="currentUser.userPwd"
        type="password"
        style="width: 150px"
      />
      <br><br>
      <span class="text">地址</span>
      <Input
        v-model="currentUser.address"
        style="width: 150px"
      />
      <br><br>
      <span class="text">联系方式</span>
      <Input
        v-model="currentUser.telephone"
        style="width: 150px"
      />
      <br><br>
      <span class="text">邮箱</span>
      <Input
        v-model="currentUser.mailbox"
        style="width: 150px"
      />
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          key: 'index'
        },
        {
          title: '用户名',
          key: 'userName',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.userName)
            ]);
          }
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '联系方式',
          key: 'telephone'
        },
        {
          title: '邮箱',
          key: 'mailbox'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      data: [],
      getList: [],     //存所有的列表数据
      loading: false,
      edit_modal: false,  //控制编辑框的显示与否
      currentUser: {
        _id: '',
        userName: '',
        userPwd: '',
        address: '',
        telephone: '',
        mailbox: ''
      },
      before_Data: {},  //编辑之前的数据

      selectedList: [],  //多选时选中的数据
      pageParams: {   //分页的属性
        page: 1,
        pageSize: 2,
        total: 50
      }
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    /**获取管理员列表 */
    getUserList(flag) {
      this.$http.get('/admin/userList', { params: this.pageParams }).then(response => {
        let res = response.data
        this.pageParams.total = res.result.count
        for (let i in res.result.list) {
          res.result.list[i].index = (this.pageParams.page - 1) * this.pageParams.pageSize + parseInt(i) + 1
        }
        if (flag) {
          this.getList = this.data.concat(res.result.list)
          this.data = res.result.list
        } else {
          this.data = res.result.list
        }
      })
    },
    /**保存编辑内容 */
    saveEdit() {
      // if (this.currentUser == this.before_Data) {
      //   this.edit_modal = false
      //   this.$Message.info('没有做任何修改！')
      // } else {
      this.$http.post('/admin/edit_user', this.currentUser).then(response => {
        let res = response.data
        if (res.status == '0') {
          this.$Message.success(res.msg)
          this.edit_modal = false
          this.getUserList()
        } else {
          this.$Message.error(res.msg)
        }
      })
      // }
    },

    /**显示编辑modal */
    show(index) {
      this.edit_modal = true
      let data = this.data[index]
      this.currentUser = this.data[index]

      this.before_Data = data

    },
    /**删除某一用户 */
    remove(index) {
      // console.log(this.data)
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除该用户吗？</p>',
        onOk: () => {
          this.$http.post('/admin/delete_user', { _id: this.data[index]._id }).then(response => {
            if (response.data.status == '0') {
              this.$Message.success(response.data.msg)
              this.data.splice(index, 1);
            }
          })
        },
      });

    },

    /**批量删除用户 */
    removeAll() { },

    getSelect(select) {
      console.log(select)
    },
    pageChange(page) {
      this.pageParams.page = page
      this.getUserList(true)
    }
  },


}


</script>

<style lang="less">
#userList {
  padding-top: 40px;
  .title {
    font-size: 24px;
    color: black;
    margin-bottom: 10px;
  }
  .table_box {
    margin-top: 30px;
  }
  .ivu-modal-body {
    padding: 40px 70px !important;
  }
  .page_box {
    text-align: center;
  }
}
.text {
  display: inline-block;
  width: 80px;
}
</style>
