var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb')
var db = require('monk')('localhost:27017/seDB2')
var multer = require('multer')
var upload = multer({
  dest: './public/images'
})
var stripe = require('stripe')('sk_test_51HlonRLvj6Kx3Vvxua4k1gTnC0YuSCz9fCuwl87DbCaNqu3fYKbXdYPDoUtzhq909n4HIRgOEEI6kpHhfaiOs6Rb00iCyf3ub5')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminsRouter = require('./routes/admins');
var membersRouter = require('./routes/members');

var app = express();

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.descriptionText = function (text, length) {
  return text.substring(0, length)
}

app.locals.formatMoney = function (number) {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

app.post('/payment', function (req, res) {
  var token = req.body.stripeToken
  var amount = req.body.amount
  var chambers = db.get('Chambers')
  var chamber_id = req.body.chamber_id
  var history = db.get('History')
  history.insert({
    user_id: req.body.user_id,
    username: req.body.username,
    hotel: req.body.hotel,
    price: req.body.price,
    date: new Date(),
    day: req.body.day
  })
  var charge = stripe.charges.create({
    amount: amount,
    currency: "usd",
    source: token
  }, function (err, charge) {
    if (err) throw err
  })
  res.redirect('/')
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/members', membersRouter);
app.use('/admins', adminsRouter);


module.exports = app;