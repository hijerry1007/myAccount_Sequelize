const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
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

// 路由
// 首頁
app.get('/', (req, res) => {
  res.send('hello world')
})


// app.use('/', require('./routes/home'))
// app.use('/record', require('./routes/records'))
app.use('/users', require('./routes/user'))
// app.use('/auth', require('./routes/auths'))

// 設定 express port 3000
app.listen(port, () => {
  console.log(`App is running on port ${port}!`)
})