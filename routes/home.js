const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const Record = db.record

const category = require('../data/category.json').category
const month = require('../data/month.json').month
const year = require('../data/yearGenerator')

const { authenticated } = require('../config/auth.js')
const { Op } = require('sequelize')


router.get('/', authenticated, (req, res) => {
  // 分頁
  let pageSize = 3
  let currentPage = 1
  let pageNumber = req.query.page || 1
  let offset = (pageNumber - currentPage) * pageSize

  let { dateBeg, dateEnd, selectedCategory } = req.query
  let errors = []

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
        console.log(selectedCategory)
        return Record.findAll({
          raw: true,
          nest: true,
          where: { category: selectedCategory }
        })
      })
      .then((records) => {
        let totalPages = Math.ceil(records.length / pageSize) || 1
        const pages = []
        for (let i = 1; i < totalPages + 1; i++) {
          pages.push({ page: i })
        }
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        let pageData = records.slice(offset, offset + pageSize)
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, errors, pages, pageData, pageNumber })
      })
      .catch((error) => {
        return res.status(422).json(error)
      })
  }
  else if ((dateBeg === '' && dateEnd !== '') || (dateBeg !== '' && dateEnd === '')) {
    //錯誤情形
    errors.push({ message: '請選擇要搜尋的起始及結束的時間' })
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
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, errors, pages, pageData, pageNumber })
      })
      .catch((error) => {
        return res.status(422).json(error)
      })
  }
  else if (dateBeg !== '' && dateEnd !== '') {
    if (selectedCategory === 'all') {
      User.findByPk(req.user.id)
        .then((user) => {
          if (!user) throw new Error('User is not found')

          return Record.findAll({
            raw: true,
            nest: true,
            where: {
              date: {
                [Op.gte]: dateBeg,
                [Op.lte]: dateEnd
              }
            }
          })
        })
        .then((records) => {
          let totalPages = Math.ceil(records.length / pageSize) || 1
          const pages = []
          for (let i = 1; i < totalPages + 1; i++) {
            pages.push({ page: i })
          }
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
    else {
      User.findByPk(req.user.id)
        .then((user) => {
          if (!user) throw new Error('User is not found')

          return Record.findAll({
            raw: true,
            nest: true,
            where: {
              category: selectedCategory,
              $and: [
                { date: { $gte: dateBeg } },
                { date: { $lte: dateEnd } }
              ]
            }
          })
        })
        .then((records) => {
          let totalPages = Math.ceil(records.length / pageSize) || 1
          const pages = []
          for (let i = 1; i < totalPages + 1; i++) {
            pages.push({ page: i })
          }
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

  }

})

router.get('/search', authenticated, (req, res) => {
  let pageSize = 3
  let currentPage = 1
  let pageNumber = req.query.page || 1
  let offset = (pageNumber - currentPage) * pageSize
  const keyword = req.query.keyword
  // const regexp = new RegExp(keyword, "i")
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error('User is not found')

      return Record.findAll({
        raw: true,
        nest: true,
        where: {
          shop: keyword
        }
      })
    })
    .then((records) => {
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
      }
      let pageData = records.slice(offset, offset + pageSize)

      return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, pageData })
    })
    .catch((error) => {
      return res.status(422).json(error)
    })

})



module.exports = router
