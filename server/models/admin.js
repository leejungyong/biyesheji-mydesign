var mongoose = require('./db.js')

var adminSchema = new mongoose.Schema({
  name: String,
  pwd: String
})

module.exports = mongoose.model('Adminisrtator', adminSchema, 'administrators')
