<template>
  <div id="goods_add">
    <div class="title">
      新增物品
    </div>
    <div class="detail_box">
      <form action="">

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
          v-model="newGoods.category"
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
        /><br><br>
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

      </form>
      <Button
        type="primary"
        class="save fr clearfix"
        @click="saveGoods"
      >确认保存</Button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      newGoods: {
        name: '',
        title: '',
        price: 0,
        information: '',
        num: 1,
        img: '',
        category: '',
        datetime: new Date()
      },
      img: '',
      imgs: [],
      // imgData:{
      //   accept:'image/gif,image/jpeg,image/png,image/jpg'
      // }
    }
  },
  mounted() {
    this.getAllCategory()
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
      // type = img1.type,
      // size = img1.size
      // if(this.imgData.accept.indexOf(type) == -1){
      //         alert('请选择我们支持的图片格式！');
      //         return false;
      //     }
      //     if(size>3145728){
      //         alert('请选择3M以内的图片！');
      //         return false;
      //     }
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

    /** 确认添加商品 */
    saveGoods() {
      this.newGoods.datetime = new Date()
      let param = this.newGoods
      this.$http.post('/admin/add_goods', this.newGoods).then((result) => {
        let res = result.data
        if (res.status == '0') {
          this.$Message.success(res.msg)
          this.$router.push('/admin/goods')
        } else {
          this.$Message.info(res.msg)
        }

      })
    },
  }
}
</script>

<style lang="less">
#goods_add {
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
