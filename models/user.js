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
// authenticate input against database documents
UserSchema.statics.authenticate = function (email, password, callback) {  // add method directly to the model
  User.findOne({email: email})
    .exec(function(error, user) {  // perform ^ search and use the callback to process the results
      if (error) {
        return callback(error); // callback?
      } else if ( !user ) {
        let err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(error,result){
        if (result === true) {
          return callback(null, user)  // default err => others
        } else {
          return callback();
        }
      });
    });
}

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




