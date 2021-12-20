var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/seDB2';

mongoose.connect(mongoDB, {
  useNewUrlParser: true
})
//Connect
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb Connect Error'));

var memberSchema = mongoose.Schema({
  username: {
    type: String
  },
  fname: {
    type: String
  },
  lname: {
    type: String
  },
  email: {
    type: String
  }
});
var Member = module.exports = mongoose.model('members', memberSchema)

module.exports.getMemberByUserName = function(username, callback) {
  var query = {
    username: username
  }
  Member.findOne(query, callback);
}
