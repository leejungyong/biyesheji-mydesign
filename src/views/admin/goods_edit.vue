<template>
  <div id="goods_edit">
    <div class="title">
      编辑物品
    </div>
    <div class="detail_box">
      <strong>物品名称： </strong>
      <Input
        style="width:200px;"
        v-model="newGoods.name"
      /><br><br><br>
      <strong>物品标题：</strong>
      <Input
        style="width:200px;"
        v-model="newGoods.title"
      /><br><br><br>
      <strong>物品数量： </strong>
      <InputNumber
        :max="999"
        :min="1"
        :step="1"
        v-model="newGoods.num"
      ></InputNumber><br><br><br>
      <strong>物品价格： </strong>
      <InputNumber
        :max="99999"
        :min="0"
        :step="10"
        v-model="newGoods.price"
      ></InputNumber><br><br><br />
      <strong>物品类别： </strong>
      <Select
        v-model="newGoods.category_id"
        style="width:200px"
      >
        <Option
          v-for="item in categoryList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</Option>
      </Select><br><br><br>
      <strong>物品详情： </strong>
      <Input
        type="textarea"
        style="width:300px;"
        :rows='4'
        v-model="newGoods.information"
      /><br><br><br>
      <input
        type="file"
        accept="image/gif,image/jpeg, image/png, image/jpg"
        @change="onChangeImg($event)"
        class="inputfile"
        id="file"
      >
      <label
        for="file"
        class="btn"
      >上传图片</label><br><br>

      <div class="img_box">
        <img
          :src="img"
          alt=""
          class="img"
        >
      </div>

      <Button
        type="primary"
        class="save fr clearfix"
        @click="saveEdit"
      >确认修改</Button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      newGoods: {
        _id: '',
        name: '',
        title: '',
        price: 0,
        information: '',
        num: null,
        img: '',
        category_id: '',
        datetime: new Date()
      },
      img: ''
    }
  },
  mounted() {
    this.getAllCategory()
    let currentGoods = this.$route.params
    this.newGoods._id = currentGoods._id,
      this.newGoods.name = currentGoods.p_name,
      this.newGoods.title = currentGoods.p_title,
      this.newGoods.price = currentGoods.p_price,
      this.newGoods.information = currentGoods.p_information,
      this.newGoods.num = currentGoods.p_num,
      this.newGoods.img = currentGoods.p_img,
      this.newGoods.category_id = currentGoods.category._id,
      this.newGoods.datetime = currentGoods.p_datetime
    this.img = '../../../static/' + this.newGoods.img
  },
  methods: {
    /** 获取类别列表 */
    getAllCategory() {
      this.$http.get('/admin/categoryList').then((result) => {
        let res = result.data
        res.result.forEach((item, index) => {
          this.categoryList.push({ value: item._id, label: item.category_name })
        })
      })
    },
    onChangeImg(event) {
      // this.newGoods.img = event.target.files[0].name
      let reader = new FileReader(),
        img1 = event.target.files[0]
      let url = ''
      let form = new FormData();
      form.append('file', img1);
      console.log(img1)
      this.$http.post('/admin/file_upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        if (response.data.status == '0') {
          this.img = '../../../static/' + response.data.result.imageName
          this.newGoods.img = response.data.result.imageName
          return
        }
        // url = response.data.url
        // reader.readAsDataURL(img1)
        // var that = this
        // reader.onloadend = function () {
        //   that.imgs.push(url)
        // }
        // this.$Message.success('')
      })
    },

    /**保存修改商品 */
    saveEdit() {
      this.$http.post('/admin/edit_goods', this.newGoods).then(response => {
        let res = response.data
        if (res.status == '0') {
          this.$Message.success(res.msg)
          this.$router.push('/admin/goods')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
  }
}
</script>

<style lang="less">
#goods_edit {
  color: black;
  padding-top: 40px;
  padding-bottom: 40px;
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }
  .detail_box {
    margin-top: 25px;
    margin-left: 20px;
    padding: 41px 70px 70px 70px;
    background: white;
    width: 850px;
    border-radius: 10px;

    span {
    }
    .save {
    }
    .inputfile {
      z-index: -11111;
      width: 0px;
      height: 1px;
      outline: none;
    }
    .btn {
      background: rgb(45, 184, 45);
      color: white;
    }
    .img_box {
      width: 60px;
      height: 60px;
    }
    .img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      border-radius: 3px;
      box-shadow: 1px 1px 1px 1px #e2e2e2;
    }
  }
}
</style>
