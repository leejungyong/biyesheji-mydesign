<template>
  <div id="adminList">
    <div class="title">管理员列表</div><br>
    <Button
      type="primary"
      shape="circle"
      size="large"
      @click.native="openModal"
    >
      <Icon type="ios-add" />
      添加管理员</Button>
    <Button
      type="primary"
      shape="circle"
      size="large"
      style="margin-left:10px"
      @click.native="openModal"
    >
      <Icon type="md-trash" />
      批量删除</Button>
    <div class="table_box">
      <Table
        border
        :columns="columns"
        :data="data"
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
      v-model="modal"
      title="添加管理员"
      :loading="loading"
      @on-ok="asyncOK"
    >
      <span class="text">用户名</span>
      <Input
        v-model="name"
        placeholder="用户名"
        style="width: 150px"
      />
      <br><br>
      <span class="text">密码</span>
      <Input
        v-model="pwd"
        type="password"
        placeholder="密码"
        style="width: 150px"
      />
      <br>
      <br>
      <span class="text">确认密码</span>
      <Input
        v-model="pwdConfirm"
        type="password"
        placeholder="确认密码"
        style="width: 150px"
      />
    </Modal>
    <Modal
      v-model="edit_modal"
      title="编辑管理员"
      :loading="loading"
      @on-ok="saveEdit"
    >
      <span class="text">用户名</span>
      <Input
        v-model="currentAdmin.name"
        placeholder="用户名"
        style="width: 150px"
      />
      <br><br>
      <span class="text">密码</span>
      <Input
        v-model="currentAdmin.pwd"
        type="password"
        placeholder="密码"
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
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.name)
            ]);
          }
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
      data: [],        //存当前页展示的数据
      getList: [],     //存所有的列表数据
      modal: false,   //控制添加框的显示与否
      loading: false,
      name: '',
      pwd: '',
      pwdConfirm: '',
      edit_modal: false,  //控制编辑框的显示与否
      currentAdmin: {
        _id: '',
        name: '',
        pwd: ''
      },
      before_Data: {  //编辑之前的数据
        name: '',
        pwd: ''
      },
      pageParams: {   //分页的属性
        page: 1,
        pageSize: 4,
        total: 50
      }

    }
  },
  mounted() {
    this.getAdminList()
  },
  methods: {
    /**获取管理员列表 */
    getAdminList(flag) {
      this.$http.get('/admin/adminList', { params: this.pageParams }).then(response => {
        let res = response.data
        this.pageParams.total = res.result.count
        if (res.status == '0') {
          for (let i in res.result.list) {
            res.result.list[i].index = (this.pageParams.page - 1) * this.pageParams.pageSize + parseInt(i) + 1
          }
          if (flag) {
            this.getList = this.data.concat(res.result.list)
            this.data = res.result.list
          } else {
            this.data = res.result.list
          }
        } else {
          this.$Message.info('获取列表失败！')
        }

      })
    },
    openModal() {
      this.modal = true
    },
    /**添加管理员 */
    asyncOK() {

      // console.log(this.name)
      if (this.name == '') {
        this.$Message.info('用户名不能为空！');
      } else if (this.pwd == '' || this.pwdConfirm == '') {
        this.$Message.info('密码不能为空！')
      } else {
        if (this.pwd != this.pwdConfirm) {
          this.$Message.info('两次输入的密码不相同！')
        } else {
          this.$http.post('/admin/add', {
            name: this.name,
            pwd: this.pwd
          }).then(response => {
            let res = response.data
            if (res.status == '0') {
              this.modal = false;
              this.$Message.success(res.msg)
              this.getAdminList()
            } else {
              this.modal = false;
              this.$Message.error(res.msg)
            }

          })
        }
      }

    },
    /**保存编辑内容 */
    saveEdit() {
      console.log(this.currentAdmin)
      console.log(this.before_Data)
      if (this.currentAdmin.name != this.before_Data.name || this.currentAdmin.pwd != this.before_Data.pwd || (this.currentAdmin.name != this.before_Data.name && this.currentAdmin.pwd != this.before_Data.pwd)) {
        this.$http.post('/admin/edit', this.currentAdmin).then(response => {
          let res = response.data
          if (res.status == '0') {
            this.$Message.success(res.msg)
            this.edit_modal = false
            this.getAdminList()
          } else {
            this.$Message.error(res.msg)
          }
        })
      } else {
        this.edit_modal = false
        this.$Message.info('没有做任何修改！')
      }

    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    /**显示编辑modal */
    show(index) {
      this.edit_modal = true
      this.currentAdmin._id = this.data[index]._id
      this.currentAdmin.name = this.data[index].name
      this.currentAdmin.pwd = this.data[index].pwd

      this.before_Data.name = this.data[index].name
      this.before_Data.pwd = this.data[index].pwd

    },
    /**删除某一管理员 */
    remove(index) {
      // console.log(this.data)
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除该管理员吗？</p>',
        onOk: () => {
          this.$http.post('/admin/delete', { _id: this.data[index]._id }).then(response => {
            if (response.data.status == '0') {
              this.$Message.success(response.data.msg)
              this.data.splice(index, 1);
            }
          })
        },
      });

    },
    pageChange(page) {
      this.pageParams.page = page
      this.getAdminList(true)
    }

  }

}
</script>

<style lang="less">
#adminList {
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
