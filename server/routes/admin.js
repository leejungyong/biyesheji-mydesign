var express = require('express')
var router = express.Router()

var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()

var fs = require('fs')
var path = require('path')

var Admin = require('../models/admin')
var User = require('../models/user')
var Category = require('../models/category')
var Goods = require('../models/good')

router.get('/', function(req, res, next) {
  res.send('admin')
})

/**管理员登录 */
router.post('/login', function(req, res, next) {
  var param = {
    name: req.body.userName,
    pwd: req.body.userPwd
  }
  Admin.findOne(param, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('a_userId', doc._id, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('a_userName', doc.name, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })

        // req.session.user = doc
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.name //将用户名返回前端
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

/**管理员登出 */
router.post('/logout', function(req, res, next) {
  res.cookie('a_userId', '', {
    path: '/',
    maxAge: 0
  })
  res.json({
    status: '0',
    msg: '',
    result: 0
  })
})

/**判断是否已经登录  刷新页面时 */
router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.a_userId) {
    res.json({
      status: '0',
      msg: '',
      result: { userName: req.cookies.a_userName || '' }
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

/**获取管理员列表 */
router.get('/adminList', function(req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let skip = (page - 1) * pageSize

  Admin.count().then(function(count) {
    //获得总条数
    Admin.find()
      .skip(skip)
      .limit(pageSize)
      .then(function(doc) {
        if (doc) {
          res.json({
            status: '0',
            msg: '',
            result: {
              count: count,
              list: doc
            }
          })
        }
      })
      .catch(err => {
        res.json({
          status: '1',
          msg: err
        })
      })
  })
})

/**添加管理员 */

router.post('/add', function(req, res, next) {
  var param = {
    name: req.body.name,
    pwd: req.body.pwd
  }

  Admin.findOne({ name: req.body.name }, function(err, doc1) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      // console.log(doc1)
      if (doc1) {
        res.json({
          status: '2',
          msg: '用户已存在！',
          result: ''
        })
        return
      } else {
        Admin.insertMany(param, function(err, doc2) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            res.json({
              status: '0',
              msg: '添加成功',
              result: doc2
            })
          }
        })
      }
    }
  })
})

/**修改管理员信息 */

router.post('/edit', function(req, res, next) {
  let _id = req.body._id,
    name = req.body.name,
    pwd = req.body.pwd

  Admin.update({ _id: _id }, { $set: { name: name, pwd: pwd } }, function(
    err,
    doc
  ) {
    if (err) {
      res.json({
        status: '1',
        msg: err.msg
      })
    } else {
      // console.log(doc)
      res.json({
        status: '0',
        msg: '修改成功',
        result: doc
      })
    }
  })
})

/**删除管理员 */
router.post('/delete', function(req, res, next) {})

/**获取用户列表 */
router.get('/userList', function(req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let skip = (page - 1) * pageSize

  User.count().then(function(count) {
    User.find()
      .skip(skip)
      .limit(pageSize)
      .then(function(doc) {
        if (doc) {
          res.json({
            status: '0',
            msg: '',
            result: {
              count: count,
              list: doc
            }
          })
        }
      })
      .catch(err => {
        res.json({
          status: '1',
          msg: err
        })
      })
  })
})

/**编辑用户 */
router.post('/edit_user', function(req, res, next) {
  let _id = req.body._id,
    userName = req.body.userName,
    userPwd = req.body.userPwd,
    address = req.body.address,
    telephone = req.body.telephone,
    mailbox = req.body.mailbox
  User.update(
    { _id: _id },
    { userName, userPwd, address, telephone, mailbox },
    function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          msg: '修改成功',
          result: doc
        })
      }
    }
  )
})

/**删除用户 */
router.post('/delete_user', function(req, res, next) {
  User.remove({ _id: req.body._id }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '删除成功',
        result: ''
      })
    }
  })
})

/**批量删除用户 */
router.post('/delete_many', function(req, res, next) {
  User.deleteMany()
})

/**获取分类列表 */
router.get('/categoryList', function(req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let skip = (page - 1) * pageSize

  Category.count().then(function(count) {
    //获得总条数
    Category.find()
      .skip(skip)
      .limit(pageSize)
      .then(function(doc) {
        if (doc) {
          res.json({
            status: '0',
            msg: '',
            result: {
              count: count,
              list: doc
            }
          })
        }
      })
      .catch(err => {
        res.json({
          status: '1',
          msg: err
        })
      })
  })
})

/** 新增类别 */
router.post('/add_category', function(req, res, next) {
  let param = {
    category_name: req.body.category_name
  }
  Category.findOne({ category_name: req.body.category_name }, function(
    err,
    doc2
  ) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc2) {
        res.json({
          status: '2',
          msg: '类别已存在',
          result: ''
        })
      } else {
        Category.insertMany(param, function(err, doc2) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            res.json({
              status: '0',
              msg: '添加成功',
              result: doc2
            })
            // console.log(doc2)
          }
        })
      }
    }
  })
})

/**编辑类别 */
router.post('/edit_category', function(req, res, next) {
  let _id = req.body._id,
    category_name = req.body.category_name

  Category.update({ _id: _id }, { category_name }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '修改成功',
        result: doc
      })
    }
  })
})

/**删除某一类别 */
router.post('/delete_category', function(req, res, next) {
  Category.remove({ _id: req.body._id }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '删除成功',
        result: ''
      })
    }
  })
})

/**获取商品列表 */
router.get('/goodsList', function(req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let skip = (page - 1) * pageSize

  Goods.count().then(function(count) {
    //获得总条数
    Goods.find()
      .populate('category')
      .skip(skip)
      .limit(pageSize)
      .then(function(doc) {
        if (doc) {
          res.json({
            status: '0',
            msg: '',
            result: {
              count: count,
              list: doc
            }
          })
          // console.log(doc)
        }
      })
      .catch(err => {
        res.json({
          status: '1',
          msg: err
        })
      })
  })
})

/**添加商品 */
router.post('/add_goods', function(req, res, next) {
  var param = {
    p_name: req.body.name,
    p_title: req.body.title,
    p_price: req.body.price,
    p_information: req.body.information,
    p_num: req.body.num,
    p_img: req.body.img,
    category: req.body.category,
    p_datetime: req.body.datetime
  }

  Goods.insertMany(param, function(err, doc2) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '添加成功',
        result: doc2
      })
      // console.log(doc2)
    }
  })
})

/**删除商品 */
router.post('/delete_goods', function(req, res, next) {
  Goods.remove({ _id: req.body._id }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '删除成功',
        result: ''
      })
    }
  })
})

/**编辑商品 */
router.post('/edit_goods', function(req, res, next) {
  let _id = req.body._id,
    p_name = req.body.name,
    p_title = req.body.title,
    p_price = req.body.price,
    p_information = req.body.information,
    p_num = req.body.num,
    p_img = req.body.img,
    category = req.body.category_id,
    p_datetime = req.body.datetime

  Goods.update(
    { _id: _id },
    {
      p_name,
      p_title,
      p_price,
      p_information,
      p_num,
      p_img,
      category,
      p_datetime
    },
    function(err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          msg: '修改成功',
          result: doc
        })
      }
    }
  )
})

/**上传图片到本地文件夹*/
router.post('/file_upload', multipartMiddleware, function(req, res, next) {
  // console.log(__dirname)
  var postData = req.files.file
  var filePath = postData.path
  var originalFilename = postData.originalFilename
  if (originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now()
      var type = postData.type.split('/')[1]
      var poster = timestamp + '.' + type

      //将文件保存到特定目录
      var newPath = path.join(__dirname, '../../', '/static/' + poster)
      fs.writeFile(newPath, data, function(err) {
        req.poster = poster
        res.json({
          status: '0',
          msg: '上传成功',
          result: { imageName: poster }
        })
      })
    })
    return
  } else {
    res.json({
      status: '1',
      msg: '上传失败',
      result: ''
    })
  }
})
module.exports = router
