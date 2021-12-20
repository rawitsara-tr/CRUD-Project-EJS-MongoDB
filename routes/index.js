var express = require('express');
var router = express.Router();
var moment = require('moment')

var mongodb = require('mongodb')
var db = require('monk')('localhost:27017/seDB2')

router.get('/', function (req, res, next) {
  var chambers = db.get('Chambers')
  var sectors = db.get('sector')
  chambers.find({}, {}, function (err, chamber) {
    sectors.find({}, {}, function (err, sector) {
      res.render('index', {
        chambers: chamber,
        sectors: sector
      })
    })
  })
});

router.get('/details/:id', function (req, res, next) {
  var chambers = db.get('Chambers')
  var sectors = db.get('sector')
  chambers.find(req.params.id, {}, function (err, chamber) {
    sectors.find({}, {}, function (err, sector) {
      res.render('users/details', {
        chambers: chamber,
        sectors: sector,
        moment: moment
      })
    })
  })
});

router.get('/search/', function (req, res, next) {
  var chambers = db.get('Chambers')
  var sector = req.query.sectorKeyword
  var province = req.query.provinceKeyword
  var name = req.query.nameKeyword
  var type = req.query.typeKeyword
  if (sector) {
    chambers.find({ sector: sector }, {}, function (err, chamber) {
      res.render('users/searchBykeyword', {
        chambers: chamber,
        moment: moment,
        Keyword: sector
      })
    })
  }
  if (province) {
    chambers.find({ province: province }, {}, function (err, chamber) {
      res.render('users/searchBykeyword', {
        chambers: chamber,
        moment: moment,
        Keyword: province
      })
    })
  }
  if (name) {
    chambers.find({ name: name }, {}, function (err, chamber) {
      res.render('users/searchBykeyword', {
        chambers: chamber,
        moment: moment,
        Keyword: name
      })
    })
  }
  if (type) {
    chambers.find({ type: type }, {}, function (err, chamber) {
      res.render('users/searchBykeyword', {
        chambers: chamber,
        moment: moment,
        Keyword: type
      })
    })
  }
});

function enSureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/users/login');
  }
}

module.exports = router;
