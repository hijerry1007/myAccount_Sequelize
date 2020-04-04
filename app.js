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


// 路由
// 首頁
app.get('/', (req, res) => {
  res.send('hello world')
})
// 認證系統的路由
// 登入頁面
app.get('/users/login', (req, res) => {
  res.render('login')
})
// 登入檢查
app.post('/users/login', (req, res) => {
  res.send('login')
})
// 註冊頁面
app.get('/users/register', (req, res) => {
  res.render('register')
})
// 註冊檢查
app.post('/users/register', (req, res) => {
  res.send('register')
})
// 登出
app.get('/users/logout', (req, res) => {
  res.send('logout')
})



// 設定 express port 3000
app.listen(port, () => {
  console.log(`App is running on port ${port}!`)
})