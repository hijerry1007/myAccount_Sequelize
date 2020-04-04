const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const Record = db.record
const { authenticated } = require('../config/auth')
const category = require('../data/category.json').category

// 設定record路由

// 列出全部record
router.get('/', authenticated, (req, res) => {
  res.redirect('/')
})

// 新增一筆record頁
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

//新增一筆record
router.post('/', authenticated, (req, res) => {
  // let initialCategoryAmount = [0, 0, 0, 0, 0]
  // [home, food, transport, entertainment, other]

  // if (req.body.category === '家居物業') {
  //   initialCategoryAmount[0] += req.body.amount
  // }
  // if (req.body.category === '餐飲食品') {
  //   initialCategoryAmount[1] += req.body.amount
  // }
  // if (req.body.category === '運輸交通') {
  //   initialCategoryAmount[2] += req.body.amount
  // }
  // if (req.body.category === '休閒娛樂') {
  //   initialCategoryAmount[3] += req.body.amount
  // }
  // if (req.body.category === '其他') {
  //   initialCategoryAmount[4] += req.body.amount
  // }
  Record.create({
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
    shop: req.body.shop,
    UserId: req.user.id,
  })
    .then(() => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(error) })
})

//修改record頁面
router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.findOne({
        where: {
          Id: req.params.id,
          UserId: req.user.id,
        }
      })
    })
    .then((record) => { return res.render('edit', { record: record.get() }) })
})

//修改record
router.put('/:id', authenticated, (req, res) => {
  const { name, date, category, amount } = req.body
  let errors = []
  if (!name || !date || !category || !amount) {
    errors.push({ message: '所有欄位都是必填' })
  };

  if (errors.length > 0) {
    Record.findOne({ where: { Id: req.params.id, UserId: req.user.id } })
      .then((record) => {
        return res.render('edit', { record: record.get(), errors })
      })
      .catch((error) => { return res.status(422).json(error) })
  }
  else {
    Record.findOne({ where: { Id: req.params.id, UserId: req.user.id } })
      .then((record) => {
        record.name = name
        record.date = date
        record.category = category
        record.amount = amount
        return record.save()
      })
      .then((record) => {
        return res.redirect('/')
      })
      .catch((error) => { return res.status(422).json(error) })
  }
})

//刪除record
router.delete('/:id', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.destroy({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      })
    })
    .then((record) => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(error) })
})


// 圖表頁面
// router.get('/chart', authenticated, (req, res) => {

//   let { dateBeg, dateEnd, selectedCategory } = req.query
//   let errors = []
//   console.log(dateBeg)
//   if (!dateBeg && !dateEnd && !selectedCategory) {
//     errors.push({ message: '您可以輸入要篩選的時間與類別' })

//     User.findByPk(req.user.id)
//       .then((user) => {
//         if (!user) throw new Error("user not found")
//         return Record.findAll({
//           raw: true,
//           nest: true,
//           where: { UserId: req.user.id, }
//         })
//       })
//       .then((records) => {
//         let homeAmount = 0
//         let foodAmount = 0
//         let transportAmount = 0
//         let entertainmentAmount = 0
//         let otherAmount = 0
//         records.forEach(record => {
//           homeAmount += record.categoryAmount[0]
//           foodAmount += record.categoryAmount[1]
//           transportAmount += record.categoryAmount[2]
//           entertainmentAmount += record.categoryAmount[3]
//           otherAmount += record.categoryAmount[4]
//         })

//         let totalAmount = homeAmount + foodAmount + transportAmount + entertainmentAmount + otherAmount
//         return res.render('chart', { records, totalAmount, homeAmount, foodAmount, transportAmount, entertainmentAmount, otherAmount, category: category, errors })
//       })
//       .catch((error) => {
//         return res.status(422).json(error)
//       })
//   }
//   else if (dateBeg === '' && dateEnd === '' && selectedCategory !== '') {
//     //有類別沒時間
//     User.findByPk(req.user.id)
//       .then((user) => {
//         if (!user) throw new Error('User is not found')
//         console.log(selectedCategory)
//         return Record.findAll({
//           raw: true,
//           nest: true,
//           where: { category: selectedCategory }
//         })
//       })
//       .then((records) => {
//         let homeAmount = 0
//         let foodAmount = 0
//         let transportAmount = 0
//         let entertainmentAmount = 0
//         let otherAmount = 0
//         records.forEach(record => {
//           homeAmount += record.categoryAmount[0]
//           foodAmount += record.categoryAmount[1]
//           transportAmount += record.categoryAmount[2]
//           entertainmentAmount += record.categoryAmount[3]
//           otherAmount += record.categoryAmount[4]
//         })

//         let totalAmount = homeAmount + foodAmount + transportAmount + entertainmentAmount + otherAmount
//         return res.render('chart', { records, totalAmount, homeAmount, foodAmount, transportAmount, entertainmentAmount, otherAmount, category: category })
//       })
//       .catch((error) => {
//         return res.status(422).json(error)
//       })

//   }
//   else if ((dateBeg === '' && dateEnd !== '') || (dateBeg !== '' && dateEnd === '')) {
//     //錯誤情形
//     errors.push({ message: '請選擇要搜尋的起始及結束的時間' })
//     User.findByPk(req.user.id)
//       .then((user) => {
//         if (!user) throw new Error("user not found")
//         return Record.findAll({
//           raw: true,
//           nest: true,
//           where: { UserId: req.user.id, }
//         })
//       })
//       .then((records) => {
//         let homeAmount = 0
//         let foodAmount = 0
//         let transportAmount = 0
//         let entertainmentAmount = 0
//         let otherAmount = 0
//         records.forEach(record => {
//           homeAmount += record.categoryAmount[0]
//           foodAmount += record.categoryAmount[1]
//           transportAmount += record.categoryAmount[2]
//           entertainmentAmount += record.categoryAmount[3]
//           otherAmount += record.categoryAmount[4]
//         })

//         let totalAmount = homeAmount + foodAmount + transportAmount + entertainmentAmount + otherAmount
//         return res.render('chart', { records, totalAmount, homeAmount, foodAmount, transportAmount, entertainmentAmount, otherAmount, category: category })
//       })
//       .catch((error) => {
//         return res.status(422).json(error)
//       })

//   }
//   else if (dateBeg !== '' && dateEnd !== '') {
//     if (selectedCategory === 'all') {
//       User.findByPk(req.user.id)
//         .then((user) => {
//           if (!user) throw new Error('User is not found')

//           return Record.findAll({
//             raw: true,
//             nest: true,
//             where: {
//               date: {
//                 [Op.gte]: dateBeg,
//                 [Op.lte]: dateEnd
//               }
//             }
//           })
//         })
//         .then((records) => {
//           let homeAmount = 0
//           let foodAmount = 0
//           let transportAmount = 0
//           let entertainmentAmount = 0
//           let otherAmount = 0
//           records.forEach(record => {
//             homeAmount += record.categoryAmount[0]
//             foodAmount += record.categoryAmount[1]
//             transportAmount += record.categoryAmount[2]
//             entertainmentAmount += record.categoryAmount[3]
//             otherAmount += record.categoryAmount[4]
//           })

//           let totalAmount = homeAmount + foodAmount + transportAmount + entertainmentAmount + otherAmount
//           return res.render('chart', { records, totalAmount, homeAmount, foodAmount, transportAmount, entertainmentAmount, otherAmount, category: category })
//         })
//         .catch((error) => {
//           return res.status(422).json(error)
//         })
//     }
//     else {
//       User.findByPk(req.user.id)
//         .then((user) => {
//           if (!user) throw new Error('User is not found')

//           return Record.findAll({
//             raw: true,
//             nest: true,
//             where: {
//               category: selectedCategory,
//               $and: [
//                 { date: { $gte: dateBeg } },
//                 { date: { $lte: dateEnd } }
//               ]
//             }
//           })
//         })
//         .then((records) => {
//           let homeAmount = 0
//           let foodAmount = 0
//           let transportAmount = 0
//           let entertainmentAmount = 0
//           let otherAmount = 0
//           records.forEach(record => {
//             homeAmount += record.categoryAmount[0]
//             foodAmount += record.categoryAmount[1]
//             transportAmount += record.categoryAmount[2]
//             entertainmentAmount += record.categoryAmount[3]
//             otherAmount += record.categoryAmount[4]
//           })

//           let totalAmount = homeAmount + foodAmount + transportAmount + entertainmentAmount + otherAmount
//           return res.render('chart', { records, totalAmount, homeAmount, foodAmount, transportAmount, entertainmentAmount, otherAmount, category: category })
//         })
//         .catch((error) => {
//           return res.status(422).json(error)
//         })
//     }
//   }
// })

module.exports = router
