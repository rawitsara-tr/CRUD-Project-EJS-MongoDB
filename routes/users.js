var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Member = require('../models/members');
var Admin = require('../models/admins');

var mongodb = require('mongodb')
var db = require('monk')('localhost:27017/seDB2')

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const {
  check,
  validationResult
} = require('express-validator');

router.get('/contact', function (req, res, next) {
  res.render('users/contact');
});

router.get('/register', function (req, res, next) {
  res.render('users/register');
});

router.get('/login', function (req, res, next) {
  res.render('users/login');
});

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/users/login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: true
}),
  function (req, res) {
    var usertype = req.user.type;
    res.redirect('/' + usertype + 's/chambers');
  });

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUserName(username, function (err, user) {
    if (err) throw err;
    console.log(user);
    if (!user) {
      return done(null, false);
    }
    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) return err;
      console.log(isMatch);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
}));

router.post('/register', [
  check('username', 'กรุณาป้อน Username').not().isEmpty(),
  check('password', 'กรุณาป้อนรหัสผ่าน').not().isEmpty(),
  check('email', 'กรุณาป้อนอีเมล').isEmail(),
  check('fname', 'กรุณาป้อนชื่อของท่าน').not().isEmpty(),
  check('lname', 'กรุณาป้อนนามสกุลของท่าน').not().isEmpty(),

], function (req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  //Validation Data
  if (!result.isEmpty()) {
    //Return error to views
    res.render('users/register', {
      errors: errors
    })
  } else {
    var username = req.body.username;
    var type = req.body.type;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = new User({
      username: username,
      email: email,
      password: password,
      type: type
    });
    if (type == "member") {
      var newMember = new Member({
        username: username,
        fname: fname,
        lname: lname,
        email: email
      });
      User.saveMember(newUser, newMember, function (err, user) {
        if (err) throw err
      })
    } else {
      var newAdmin = new Admin({
        username: username,
        fname: fname,
        lname: lname,
        email: email
      });
      User.saveAdmin(newUser, newAdmin, function (err, user) {
        if (err) throw err
      })
    }
    res.redirect('/users/login');
  }
});

module.exports = router;
