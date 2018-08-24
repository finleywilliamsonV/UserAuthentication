function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {  // user is logged in
    return res.redirect('/profile');
  }
  return next();
}

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    let err = new Error('This Page Requires Login.');
    err.status = 401;
    return next(err);
  }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;