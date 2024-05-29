"use strict";

var myCrypto = require('../crypto');
var authUtils = require('../auth/utils');
function loginAdminNew(adminPassword, req, res) {
  var adminId = 'admin';
  authUtils.addNewUser(adminId, adminPassword, '', 'Administrator').then(function (user) {
    authUtils.addRole4User(adminId, adminId).then(function () {
      req.session.user = user.id;
      req.session.userRole = user.id;
      res.send({
        result: true,
        user: {
          id: user.id,
          role: user.id
        },
        message: 'New admin created with same password! Please change password ASAP!'
      });
    })["catch"](function (err) {
      res.send({
        result: false,
        message: err.toString()
      });
    });
  });
}
exports.loginAdminNew = loginAdminNew;
function loginUser(user, userPassword, req, res) {
  if (!user || !user.id || !userPassword || !user.hashedPassword) {
    res.send({
      result: false,
      message: 'Not all perameters defined for proper login! User: ' + (user ? user.id : 'USER not defined')
    });
    return;
  }
  if (myCrypto.checkUserAndPassword(user.id, userPassword, user.hashedPassword)) {
    req.session.user = user.id;
    authUtils.getRoles(user).then(function (roles) {
      if (roles.length) {
        req.session.userRole = roles[0].id;
        res.send({
          result: true,
          user: {
            id: req.session.user,
            role: req.session.userRole
          },
          message: 'User login: OK! User: ' + user.id
        });
      } else {
        res.send({
          result: false,
          message: 'Not found role for user: ' + user.id
        });
      }
    })["catch"](function (err) {
      console.error(err);
      res.send({
        result: false,
        message: 'Internale error #1'
      });
    });
  } else {
    // console.warn("Login error for user", user.id, userPassword);
    res.send({
      result: false,
      message: 'Authentication failed!'
    });
  }
}
exports.loginUser = loginUser;