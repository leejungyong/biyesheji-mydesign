var mongoose = require('./db.js')

var userSchema = new mongoose.Schema({
  userName: String,
  userPwd: String,
  orderList: Array,
  cartList: [
    {
      productId: String,
      productName: String,
      salePrice: String,
      productImg: String,
      checked: String,
      productNum: String
    }
  ],
  addressList: Object
})

module.exports = mongoose.model('User', userSchema, 'users')
