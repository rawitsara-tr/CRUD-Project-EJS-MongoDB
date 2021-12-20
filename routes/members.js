var express = require('express');
var router = express.Router();
var moment = require('moment')
const { check, validationResult } = require('express-validator')

var mongodb = require('mongodb')
var db = require('monk')('localhost:27017/seDB2')

router.get('/chambers', function (req, res, next) {
  var advertises = db.get('Advertises')
  var sectors = db.get('sector')
  advertises.find({}, {}, function (err, advertise) {
    sectors.find({}, {}, function (err, sector) {
      res.render('members/chambers', {
        advertises: advertise,
        sectors: sector,
        moment: moment
      })
    })
  })
});

router.get('/history/:id', function (req, res, next) {
  var histories = db.get('History')
  histories.find(req.params.id, {}, function (err, history) {
    res.render('members/history', { histories: history })
  })
});

router.get('/contact', function (req, res, next) {
  res.render('members/contact')
});

router.post('/contact', [
  check("fname", "กรุณาป้อนชื่อ").not().isEmpty(),
  check("lname", "กรุณาป้อนนามสกุล").not().isEmpty(),
  check("phone", "กรุณาป้อนเบอร์โทรศัพท์").not().isEmpty(),
  check('email', 'กรุณาป้อนอีเมล').isEmail(),
  check("message", "กรุณาป้อนข้อความติดต่อเรา").not().isEmpty()
], function (req, res, next) {
  const result = validationResult(req)
  var errors = result.errors
  if (!result.isEmpty()) {
    res.render('members/contact', { errors: errors })
  } else {
    var contacts = db.get('Contacts')
    contacts.insert({
      type: req.body.type,
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message,
      status:req.body.status
    }, function (err, contact) {
      if (err) {
        res.send(err)
      } else {
        res.location('/')
        res.redirect('/')
      }
    })
  }
})

module.exports = router;