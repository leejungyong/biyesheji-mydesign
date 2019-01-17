var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var adminRouter = require('./routes/admin')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// app.use(function(req, res, next) {
//   if (req.cookie.userId) {
//     next()
//   } else {

//       // req.originalUrl.indexOf ('/goods')>-1 第一种方法
//       // 第二种方法  req.path=='/goods'
//     if (
//       req.originalUrl == '/users/login' ||
//       req.originalUrl == '/users/logout' ||
//       req.path=='/goods'
//     ) {
//       next()
//     } else {
//       res.json({
//         status: '10001',
//         msg: '当前未登录',
//         result: ''
//       })
//     }
//   }
// })

app.use('/', indexRouter)
app.use('/user', usersRouter)
app.use('/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// app.use(multiparty({ uploadDir: '../static' }))
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
