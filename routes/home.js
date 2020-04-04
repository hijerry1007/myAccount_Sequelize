const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const Record = db.Record

const category = require('../data/category.json').category
const month = require('../data/month.json').month
const year = require('../data/yearGenerator')

const { authenticated } = require('../config/auth.js')

router.get('/', authenticated, (req, res) => {
  // 分頁
  let pageSize = 3
  let currentPage = 1
  let pageNumber = req.query.page || 1
  let offset = (pageNumber - currentPage) * pageSize

  let { dateBeg, dateEnd, selectedCategory } = req.query
  let errors = []
  const filter_category = (selectedCategory === 'category') ? {} : { category: selectedCategory }
  if (!dateBeg && !dateEnd && !selectedCategory) {
    User.findByPk(req.user.id)
      .then((user) => {
        if (!user) throw new Error("user not found")
        return Record.findAll({
          raw: true,
          nest: true,
          where: { UserId: req.user.id, }
        })
      })
      .then((records) => {
        console.log(records)
        let totalPages = Math.ceil(records.length / pageSize) || 1
        const pages = []
        for (let i = 1; i < totalPages + 1; i++) {
          pages.push({ page: i })
        }
        let pageData = records.slice(offset, offset + pageSize)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, pages, pageData, pageNumber })
      })
      .catch((error) => {
        return res.status(422).json(error)
      })
  }
  else if (dateBeg === '' && dateEnd === '' && selectedCategory !== '') {
    User.findByPk(req.user.id)
      .then((user) => {
        if (!user) throw new Error('User is not found')

        return Record.findAll({
          raw: true,
          nest: true,
          where: { category: filter_category }
        })
      })
      .then((records) => {
        console.log(records)

        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        let pageData = records.slice(offset, offset + pageSize)
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, errors, pageData })
      })
      .catch((error) => {
        return res.status(422).json(error)
      })
  }
  else if (dateBeg !== '' && dateEnd !== '') {
    User.findByPk(req.user.id)
      .then((user) => {
        if (!user) throw new Error('User is not found')

        return Record.findAll({
          raw: true,
          nest: true,
          where: {
            category: filter_category,
            $and: [
              { date: { $gte: dateBeg } },
              { date: { $lte: dateEnd } }
            ]
          }
        })
      })
      .then((records) => {
        console.log(records)

        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        let pageData = records.slice(offset, offset + pageSize)

        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, errors, pageData })
      })
      .catch((error) => {
        return res.status(422).json(error)
      })
  }

})

module.exports = router
