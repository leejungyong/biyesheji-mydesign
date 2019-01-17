<template>
  <div id="categoryList">
    <div class="title">分类列表</div>
    <Button
      type="primary"
      shape="circle"
      size="large"
      @click.native="openAddModal"
    >
      <Icon type="ios-add" />
      新增分类
    </Button>
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
        :columns="columns"
        :data="data"
        border
      >
      </Table>
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
      v-model="add_modal"
      title="新增分类"
      :loading="loading"
      @on-ok="confirmAdd"
    >
      <span class="text">类别名称</span>
      <Input
        v-model="newCategory.category_name"
        style="width: 150px"
      />
    </Modal>
    <Modal
      v-model="edit_modal"
      title="编辑分类"
      :loading="loading"
      @on-ok="saveEdit"
    >
      <span class="text">类别名称</span>
      <Input
        v-model="currentCategory.category_name"
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
          title: '类别编号',
          key: '_id'
        },
        {
          title: '类别名称',
          key: 'category_name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.category_name)
            ])
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
            ])
          }
        }
      ],
      data: [],
      getList: [],     //存所有的列表数据
      add_modal: false,
      edit_modal: false,
      loading: false,
      newCategory: {   //新增分类
        category_name: ''
      },
      currentCategory: {
        _id: '',
        category_name: ''
      },
      pageParams: {   //分页的属性
        page: 1,
        pageSize: 4,
        total: 50
      }


    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    /**获取分类列表 */
    getCategoryList(flag) {
      this.$http.get('/admin/categoryList', { params: this.pageParams }).then(response => {
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

    /**新增弹框弹出 */
    openAddModal() {
      this.add_modal = true
    },

    /**确认添加 */
    confirmAdd() {
      if (this.newCategory.category_name == '') {
        this.$Message.info('类别名称不能为空')
      } else {
        this.$http.post('/admin/add_category', this.newCategory).then(response => {
          if (response.data.status == '0') {
            this.add_modal = false
            this.$Message.success(response.data.msg)
            this.getCategoryList()
          } else {
            this.add_modal = true
            this.$Message.error(response.data.msg)
          }
        })
      }
    },


    /**显示编辑框 */
    show(index) {
      this.edit_modal = true
      this.currentCategory._id = this.data[index]._id
      this.currentCategory.category_name = this.data[index].category_name
    },
    /**保存修改 */
    saveEdit() {
      this.$http.post('/admin/edit_category', this.currentCategory).then(response => {
        let res = response.data
        if (res.status == '0') {
          this.$Message.success(res.msg)
          this.edit_modal = false
          this.getCategoryList()
        } else {
          this.$Message.error(res.msg)
          this.edit_modal = true
        }
      })
    },

    /**删除某一条记录 */
    remove(index) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除该类别吗？</p>',
        onOk: () => {
          // console.log('JJJJJ')
          this.$http.post('/admin/delete_category', { _id: this.data[index]._id }).then(response => {
            if (response.data.status == '0') {
              this.$Message.success(response.data.msg)
              this.data.splice(index, 1)
              this.getCategoryList()
            } else {
              this.$Message.error(response.data.msg)
            }
          })
        },
      });
    },
    pageChange(page) {
      this.pageParams.page = page
      this.getCategoryList(true)
    }

  }
}
</script>

<style lang="less">
#categoryList {
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
