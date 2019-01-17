var mongoose = require('mongoose')

var categorySchema = new mongoose.Schema({
  category_id: String,
  category_name: String
})

module.exports = mongoose.model('Category', categorySchema, 'categories')
