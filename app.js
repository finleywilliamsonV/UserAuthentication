var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var mongoose = require('mongoose');

// use session for tracking logins
app.use(session({
  secret: 'satan loves dingus',
  resave: true,
  saveUninitialized: false
}));

// mongodb connection
mongoose.connect('mongodb://localhost:27017/bookworm', { useNewUrlParser: true });
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));   // __dirname refers to the file path from the server's root to our applications root folder

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
