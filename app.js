var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); // call after ^
var mongoose = require('mongoose');

// mongodb connection
mongoose.connect('mongodb://localhost:27017/bookworm', { useNewUrlParser: true });
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use session for tracking logins
app.use(session({
  secret: 'satan loves dingus',   // used to sign the cookie, to ensure only this app created it
  resave: true,                   // express will save session whether it is modified or not
  saveUninitialized: false,        // blank, uninitialized sessions will not be saved
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// make userID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;  // response obj has a property called locals, that custom variables can be appended to
  next();
});

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
