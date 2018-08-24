// Create a schema for use with mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,     // ensures provided email does not exist already
    required: true,
    trim: true        // removes any whitespace before or after input
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// hash password before saving to database
UserSchema.pre('save', function(next){
  var user = this;  // this refers to the data that Mongoose will write to MongoDB
  bcrypt.hash(user.password, 10, function(err,hash) { // @number: how many times to run the encryption algorithm
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  })  
});

var User = mongoose.model('User', UserSchema);
module.exports = User;




