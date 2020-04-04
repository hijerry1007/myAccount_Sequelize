const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const Record = db.Record

const { authenticated } = require('../config/auth.js')

router.get('/', authenticated, (req, res) => {
  res.render('index')
})

module.exports = router
