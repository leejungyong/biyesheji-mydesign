var express = require('express')
var router = express.Router()
var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

//用户登录
router.post('/login', function(req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc._id, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })

        // req.session.user = doc
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName //将用户名返回前端
          }
        })
      } else {
        res.json({
          status: '1',
          msg: '用户名或密码错误'
        })
      }
    }
  })
})

module.exports = router
