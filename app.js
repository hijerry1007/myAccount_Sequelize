const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const handlebar = require("handlebars")
const handlebarHelpers = require('handlebars-helpers')


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))

const db = require('./models')
const Record = db.Record
const User = db.User

app.use(session({
  secret: 'copycat',
  resave: 'false',
  saveUninitialized: 'false',
}))

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error')
  next()
})

// 路由
app.use('/', require('./routes/home'))
app.use('/record', require('./routes/records'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))

// 設定 express port 3000
app.listen(process.env.PORT || port, () => {
  console.log(`App is running on port ${port}!`)
})

handlebar.registerHelper('isSelected', function (selected, current, options) {
  return selected === current ? 'selected' : ''
})