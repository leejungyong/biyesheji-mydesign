var mongoose = require('./db.js')

var goodSchema = new mongoose.Schema({
  p_name: String,
  p_title: String,
  p_price: Number,
  p_information: String,
  p_num: Number,
  p_img: String,

  //关联字段
  category: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用
    ref: 'Category'
  },
  p_datetime: Date
})

module.exports = mongoose.model('Goods', goodSchema, 'goods')
