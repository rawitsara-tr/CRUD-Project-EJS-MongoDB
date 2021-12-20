var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator')

var mongodb = require('mongodb')
var db = require('monk')('localhost:27017/seDB2')
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  }
});

var upload = multer({
  storage: storage
});

router.get('/chambers', function (req, res, next) {
  var chambers = db.get('Chambers')
  var advertises = db.get('Advertises')
  chambers.find({}, {}, function (err, chamber) {
    advertises.find({}, {}, function (err, advertise) {
      res.render('admins/chambers', {
        chambers: chamber,
        advertises: advertise
      })
    })
  })
});

router.get('/history', function (req, res, next) {
  var history = db.get('History')
  history.find({}, {}, function (err, history) {
      res.render('admins/history', {
        history: history
    })
  })
});

router.get('/addChamber', function (req, res, next) {
  res.render('admins/addChamber')
});

router.get('/editChamber/:id', function (req, res, next) {
  var chambers = db.get('Chambers')
  chambers.find(req.params.id, {}, function (err, chamber) {
    res.render('admins/editChamber', { chambers: chamber })
  })
});

router.get('/contact', function (req, res, next) {
  var contacts = db.get('Contacts')
  contacts.find(req.params.id, {}, function (err, contact) {
    res.render('admins/contact', { contacts: contact })
  })
});

router.post('/addChamber', upload.single("image"), [
  check('name', 'กรุณาป้อนชื่อโรงแรม').not().isEmpty(),
  check('location', 'กรุณาป้อนสถานที่').not().isEmpty(),
  check('province', 'กรุณาป้อนจังหวัด').not().isEmpty(),
  check('bed', 'กรุณาป้อนจำนวนเตียง').not().isEmpty(),
  check('description', 'กรุณาป้อนรายละเอียด').not().isEmpty(),
  check('price', 'กรุณาใส่ราคาต่อคืน').not().isEmpty()
], function (req, res, next) {
  const result = validationResult(req)
  var errors = result.errors
  if (!result.isEmpty()) {
    res.render('admins/addChamber', { errors: errors })
  } else {
    var chambers = db.get('Chambers')
    if (req.file) {
      var chamberimage = req.file.filename
    } else {
      var chamberimage = "No Image"
    }
    chambers.insert({
      name: req.body.name,
      location: req.body.location,
      sector: req.body.sector,
      province: req.body.province,
      type: req.body.type,
      bed: req.body.bed,
      description: req.body.description,
      price: req.body.price,
      date: new Date(),
      image: chamberimage
    }, function (err, success) {
      if (err) {
        res.send(err)
      } else {
        res.location('/admins/chambers')
        res.redirect('/admins/chambers')
      }
    })
  }
});

router.get('/addAdvertise', function (req, res, next) {
  res.render('admins/addAdvertise')
});

router.post('/addAdvertise', upload.single("image"), [
  check('name', 'กรุณาป้อนชื่อโฆษณา').not().isEmpty(),
  check('description', 'กรุณาป้อนรายละเอียด').not().isEmpty()
], function (req, res, next) {
  const result = validationResult(req)
  var errors = result.errors
  if (!result.isEmpty()) {
    res.render('admins/addAdvertise', { errors: errors })
  } else {
    var advertises = db.get('Advertises')
    if (req.file) {
      var advertiseimage = req.file.filename
    } else {
      var advertiseimage = "No Image"
    }
    advertises.insert({
      name: req.body.name,
      description: req.body.description,
      date: new Date(),
      image: advertiseimage
    }, function (err, success) {
      if (err) {
        res.send(err)
      } else {
        res.location('/admins/chambers')
        res.redirect('/admins/chambers')
      }
    })
  }
});

router.get('/editChamber/:id', function (req, res, next) {
  var chambers = db.get('Chambers')
  chambers.find(req.params.id, {}, function (err, chamber) {
    res.render('admins/editChamber', { chambers: chamber })
  })
});

router.get('/updateStatus/:id', function (req, res, next) {
  var contacts = db.get('Contacts')
  contacts.find(req.params.id, {}, function (err, contact) {
    res.render('admins/updateStatus', { contacts: contact })
  })
});

router.post('/updateStatus', function (req, res, next) {
  var contacts = db.get('Contacts')
  contacts.update({
    _id: req.body.id
  }, {
    $set: {
      type: req.body.type,
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message,
      status: req.body.status
    }
  }, function (err, success) {
    if (err) {
      res.send(err)
    } else {
      res.location('/admins/contact')
      res.redirect('/admins/contact')
    }
  })
});

router.post('/editChamber', upload.single("image"), function (req, res, next) {
  var chambers = db.get('Chambers')
  
  if (req.file) {
    var chamberimage = req.file.filename
    chambers.update({
      _id: req.body.id
    }, {
      $set: {
        name: req.body.name,
        location: req.body.location,
        sector: req.body.sector,
        province: req.body.province,
        type: req.body.type,
        bed: req.body.bed,
        description: req.body.description,
        price: req.body.price,
        date: new Date(),
        image: chamberimage
      }
    }, function (err, success) {
      
      if (err) {
        res.send(err)
      } else {
        res.location('/admins/chambers')
        res.redirect('/admins/chambers')
      }
    })
  } else {
    chambers.update({
      _id: req.body.id
    }, {
      $set: {
        name: req.body.name,
        location: req.body.location,
        sector: req.body.sector,
        province: req.body.province,
        type: req.body.type,
        bed: req.body.bed,
        description: req.body.description,
        price: req.body.price,
        date: new Date()
      }
    }, function (err, success) {
      if (err) {
        res.send(err)
      } else {
        res.location('/admins/chambers')
        res.redirect('/admins/chambers')
      }
    })
  } 

});

router.post('/deleteContact/', function (req, res, next) {
  var contacts = db.get('Contacts')
  contacts.remove({ _id: req.body.id })
  res.redirect("/admins/contact")
});

router.post('/deleteChamber/', function (req, res, next) {
  var chambers = db.get('Chambers')
  chambers.remove({ _id: req.body.id })
  res.redirect("/admins/chambers")
});

router.get('/editAdvertise/:id', function (req, res, next) {
  var advertises = db.get('Advertises')
  advertises.find(req.params.id, {}, function (err, advertise) {
    res.render('admins/editAdvertise', { advertises: advertise })
  })
});

router.post('/editAdvertise', upload.single("image"), function (req, res, next) {
  var advertises = db.get('Advertises')
  if (req.file) {
    var advertiseimage = req.file.filename
    advertises.update({
      _id: req.body.id
    }, {
      $set: {
        name: req.body.name,
        description: req.body.description,
        date: new Date(),
        image: advertiseimage
      }
    }, function (err, success) {
      if (err) {
        res.send(err)
      } else {
        res.location('/admins/chambers')
        res.redirect('/admins/chambers')
      }
    })
  } else {
    advertises.update({
      _id: req.body.id
    }, {
      $set: {
        name: req.body.name,
        description: req.body.description,
        date: new Date()
      }
    }, function (err, success) {
      if (err) {
        res.send(err)
      } else {
        res.location('/admins/chambers')
        res.redirect('/admins/chambers')
      }
    })
  }

});

router.post('/deleteAdvertise/', function (req, res, next) {
  var advertises = db.get('Advertises')
  advertises.remove({ _id: req.body.id })
  res.redirect("/admins/chambers")
});

module.exports = router;