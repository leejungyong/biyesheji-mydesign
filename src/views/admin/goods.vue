<template>
  <div id="goodsList">
    <div class="title">物品列表</div>
    <Button
      type="primary"
      shape="circle"
      size="large"
      @click.native="toAdd"
    >
      <Icon type="ios-add" />
      新增物品
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
          title: '物品名称',
          key: 'p_name',
          // render: (h, params) => {
          //   return h(
          //     'strong', params.row.category_name
          //   )
          // }
        },
        {
          title: '标题',
          key: 'p_title'
        },
        {
          title: '价格',
          key: 'p_price'
        },
        {
          title: '物品详情',
          key: 'p_information'
        },
        {
          title: '数量',
          key: 'p_num'
        },
        {
          title: '图片',
          key: 'p_img',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: '/static/' + params.row.p_img
              },
              style: {
                width: '30px',
                height: '30px'
              }
            })
          }
        },
        {
          title: '物品类别',
          key: 'category'
        },
        {
          title: '上传时间',
          key: 'p_datetime'
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
      editData: [],  //传给编辑页的数据
      add_modal: false,
      edit_modal: false,
      loading: false,
      newGoods: {   //新增分类
      },
      pageParams: {   //分页的属性
        page: 1,
        pageSize: 4,
        total: 50
      }
    }
  },

  mounted() {
    this.getGoodsList()
  },
  methods: {
    /**获取分类列表 */
    getGoodsList(flag) {
      this.$http.get('/admin/goodsList', { params: this.pageParams }).then(response => {
        let res = response.data
        let goodsObject = {}
        this.pageParams.total = res.result.count
        if (res.status == '0') {
          for (let i in res.result.list) {
            res.result.list[i].index = (this.pageParams.page - 1) * this.pageParams.pageSize + parseInt(i) + 1
            this.data.push(
              {
                _id: res.result.list[i]._id,
                index: res.result.list[i].index,
                p_name: res.result.list[i].p_name,
                p_title: res.result.list[i].p_title,
                p_price: res.result.list[i].p_price,
                p_information: res.result.list[i].p_information,
                p_num: res.result.list[i].p_num,
                p_img: res.result.list[i].p_img,
                category: res.result.list[i].category.category_name,
                p_datetime: res.result.list[i].p_datetime.substring(0, 10)
              })          }
          if (flag) {
            this.getList = this.data.concat(res.result.list)
          }

          this.editData = res.result.list

        } else {
          this.$Message.info('获取列表失败！')
        }
      })
    },

    /**新增弹框弹出 */
    toAdd() {
      this.$router.push({ name: 'goods_add' })
    },

    /**跳转至编辑页 */
    show(index) {
      this.$router.push({ name: 'goods_edit', params: this.editData[index] })
    },

    /**删除某一条记录 */
    remove(index) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除该物品吗？</p>',
        onOk: () => {
          // console.log('JJJJJ')
          this.$http.post('/admin/delete_goods', { _id: this.data[index]._id }).then(response => {
            if (response.data.status == '0') {
              this.$Message.success(response.data.msg)
              this.data.splice(index, 1)
              this.getGoodsList()
            } else {
              this.$Message.error(response.data.msg)
            }
          })
        },
      });
    },
    pageChange(page) {
      this.pageParams.page = page
      this.getGoodsList(true)
      this.data = []
    }

  }
}
</script>

<style lang="less">
#goodsList {
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
