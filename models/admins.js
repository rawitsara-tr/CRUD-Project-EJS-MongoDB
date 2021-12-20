var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/seDB2';

mongoose.connect(mongoDB, {
  useNewUrlParser: true
})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb Connect Error'));

var adminSchema = mongoose.Schema({
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
  },
  rooms: [{
    room_id: {
      type: String
    },
    roomname: {
      type: String
    }
  }]
});
var Admin = module.exports = mongoose.model('admins', adminSchema)

module.exports.getAdminByUserName = function(username, callback) {
  var query = {
    username: username
  }
  Admin.findOne(query, callback);
}

module.exports.addRoom = function(info, callback) {
  admin_user = info["admin_user"]
  room_id = info["room_id"]
  roomname = info["roomname"]
  var query = {
    username: admin_user
  }
  Admin.findOneAndUpdate(
    query,{
      $push:{
        "rooms":{
          room_id:room_id,
          roomname:roomname
        }
      }
    },{
      safe:true,
      upsert:true
    },callback
  )
}


