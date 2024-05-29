"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var utils = require("../utils/utils.js");
var commonUtils = require("../utils/common");
var express = require("express");
var WS_NAME = "OLC-KPP API Web-Service version";
var WS_VERSION = "0.0.1b";
var path = require("path");
var Fs = require("fs");
var Axios = require("axios");
var app = express();
var authUtils = require("./auth/utils");
var myCrypto = require("./crypto");
var dbUtils = require("./knex/utils");
var wsUtils = require("./utils/ws");
var os = require("os");

// Patch limit of size upload image
app.use(express.json({
  extended: true,
  limit: "50mb"
}));
app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}));

// express & session & auth
//   ... i.e.: https://www.codexpedia.com/node-js/a-very-basic-session-auth-in-node-js-with-express-js/
var session = require("express-session");
if (import.meta.env.DEV) {
  // DEV || TEST
  app.use(session({
    secret: "WppQ38S-4D44-2C44",
    resave: true,
    saveUninitialized: true
  }));
} else {
  // PRODUCTION
  var sqlite = require("better-sqlite3");
  var SqliteStore = require("better-sqlite3-session-store")(session);
  var db = new sqlite(path.join("dist", "db", "sessions.db"));
  app.use(session({
    secret: "WppQ38S-4D44-2C44-PR0D",
    resave: true,
    saveUninitialized: true,
    store: new SqliteStore({
      client: db,
      expired: {
        clear: true,
        intervalMs: 3600000 //ms = 60min
      }
    })
  }));
}

// ... casl
// TODO: Remove4Vet
// const casl = require("./casl");
// app.use(casl.auth);
// ###############################################

app.post("/changeRole4User", function (req, res) {
  var postData = req.body;
  console.log("Going to chage user access role:", postData);
  if (!postData.userId || !postData.roleId) {
    res.send({
      result: false,
      message: "Invalid fields definitions to change user role!"
    });
  } else {
    dbUtils.changeRole4User(postData).then(function () {
      res.send({
        result: true,
        message: "User role changed!"
      });
    })["catch"](function (err) {
      res.send({
        result: false,
        message: err
      });
    });
  }
});
app.post("/getAllUsers", function (req, res) {
  console.log("Going to get all users");
  var _result = [];
  var _promises = [];
  dbUtils.getAllUsers(["id", "description", "phone", "rowid"]).then(function (users) {
    users.forEach(function (user) {
      _promises.push(new Promise(function (resolve, reject) {
        authUtils.getRoles(user).then(function (roles) {
          var _user = user.toJSON();
          if (roles.length) {
            _user.role = roles[0].id;
          } else {
            _user.role = "registered";
          }
          // _user.roles = [];
          // roles.forEach((role) => {
          //     _user.roles.push({ id: role.id, desc: role.description })
          // })
          _result.push(_user);
          // console.log("User found:", user.id);
          resolve(_result);
        });
      }));
    });
    return Promise.all(_promises);
  }).then(function () {
    res.send({
      result: true,
      users: _result
    });
  })["catch"](function (err) {
    res.send({
      result: false,
      message: err
    });
  });
});
app.post("/getRoles", function (req, res) {
  dbUtils.getRoles().then(function (roles) {
    res.send({
      result: true,
      roles: roles
    });
  })["catch"](function (err) {
    res.send({
      result: false,
      message: err
    });
  });
});
app.post("/getTransportTypes", function (req, res) {
  dbUtils.getTransportTypes().then(function (ttypes) {
    res.send({
      result: true,
      transportTypes: ttypes
    });
  })["catch"](function (err) {
    res.send({
      result: false,
      message: err
    });
  });
});
app.post("/updateUser", function (req, res) {
  console.log("Going to update user data");
  var userData = req.body;
  authUtils.updateUser(userData).then(function (user) {
    User.query().select(["id", "phone", "description", "rowid"]).where("rowid", userData.rowid).then(function (user) {
      res.send({
        result: true,
        user: user,
        message: "Пользователь обновлен успешно!"
      });
    })["catch"](function (err) {
      res.send({
        result: false,
        message: err
      });
    });
  })["catch"](function (err) {
    if (err && err.code == "SQLITE_CONSTRAINT_PRIMARYKEY") {
      res.send({
        result: false,
        message: "Такой пользователь уже существует в базе данных!"
      });
    } else {
      console.error(err);
      res.send({
        result: false,
        message: "Ошибка базы данных или сервера!"
      });
    }
  });
});
app.post("/addUser", function (req, res) {
  console.log("Going to add user");
  var userData = req.body;
  authUtils.addNewUserData(userData).then(function (user) {
    res.send({
      result: true,
      message: "Новый пользователь системы [" + user.id + "] создан успешно!"
    });
  })["catch"](function (err) {
    if (err && err.code == "SQLITE_CONSTRAINT_PRIMARYKEY") {
      res.send({
        result: false,
        message: "Такой пользователь уже существует в базе данных!"
      });
    } else {
      console.error(err);
      res.send({
        result: false,
        message: "Ошибка базы данных или сервера!"
      });
    }
  });
});
app.post("/checkLogin", function (req, res) {
  if (req.session && req.session.user) {
    res.send({
      result: true,
      message: "login already done!",
      user: {
        id: req.session.user,
        role: req.session.userRole
      }
    });
  } else {
    res.send({
      result: false,
      message: "no-login!",
      user: {
        id: "",
        role: ""
      }
    });
  }
});
app.post("/changePassword", function (req, res) {
  console.log("Going to change user password!");
  if (!req.body.userId || !req.body.newUserPassword) {
    res.send({
      result: false,
      message: "Не заполнено поле пользователя или пароля!"
    });
  } else {
    var userId = req.body.userId;
    var userPassword = req.body.newUserPassword;
    User.query().findById(userId).patch({
      hashedPassword: myCrypto.hashUserAndPassword(userId, userPassword)
    }).then(function () {
      console.log("User password successfully changed!");
      res.send({
        result: true,
        message: "Password changed!"
      });
    })["catch"](function (err) {
      res.send({
        result: false,
        message: err.toString()
      });
    });
  }
});
app.post("/login", function (req, res) {
  var userId = req.body.id;
  var userPassword = req.body.password;
  if (!userId || !userPassword) {
    res.send({
      result: false,
      message: "Не заполнено поле пользователя или пароля!"
    });
  } else if (userId === "admin") {
    authUtils.isUserExists("admin").then(function (user) {
      if (!user) {
        wsUtils.loginAdminNew(userPassword, req, res);
      } else {
        wsUtils.loginUser(user, req.body.password, req, res);
      }
    });
  } else {
    authUtils.isUserExists(userId).then(function (user) {
      if (user) {
        wsUtils.loginUser(user, userPassword, req, res);
      } else {
        res.send({
          result: false,
          message: "User not found!"
        });
      }
    });
  }
});

// Logout endpoint
app.post("/logout", function (req, res) {
  req.session.destroy();
  res.send({
    result: true,
    message: "logout success!",
    user: {
      id: "",
      role: ""
    }
  });
});
function getModuleInfo() {
  return WS_NAME + ": " + WS_VERSION;
}

// TODO: downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');
app.get("/", function (request, response) {
  response.sendFile(path.resolve(__dirname, "..", "..", "dist", "front", "index.html"));
});

// get objection's Cars
var Cars = require("./knex/models/Car");
var User = require("./knex/models/User.js");
var InOutInfo = require("./knex/models/InOutInfo.js");
var _require = require("objection"),
  raw = _require.raw;
app.post("/cars", function (request, response) {
  var filters = request.body;
  var q = Cars.query();
  if (filters) {
    dbUtils.setFilters(q, filters);
  }
  q.then(function (cars) {
    console.log("Found", cars.length, "cars");
    response.json({
      result: true,
      cars: cars
    });
  });
});
app.post("/cars/like/:partNumber", function (req, res) {
  var partNumber = req.params.partNumber;
  var partNumberLike = "%".concat(partNumber, "%");
  console.log("Looking for cars like:", partNumberLike);
  try {
    var q = Cars.query().select("number").where(raw("number like ?", [partNumberLike]));
    console.log(q.toKnexQuery().toQuery());
    q.then(function (cars) {
      if (cars.length) {
        res.status(200).send({
          result: true,
          cars: cars
        });
      } else {
        res.status(200).send({
          result: false,
          message: "No cars foud for part of number: " + partNumber
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      result: false,
      message: error.message
    });
  }
});
app.post("/cars/:number", function (req, res) {
  var number = req.params.number;
  console.log("Car's ID:", number);
  try {
    Cars.query().findById(number).then(function (car) {
      if (!car) {
        res.status(200).send({
          result: false,
          message: "Invalid car number: " + number
        });
      } else {
        res.status(200).send({
          result: true,
          car: car
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      result: false,
      message: error.message
    });
  }
});
app.post("/cars/:carNumber/add/info", function (req, res) {
  var carNumber = req.params.carNumber;
  var postData = req.body;
  postData.who_in_checked = req.session.user;
  postData.date_ymd = utils.ymdFormateDate();
  try {
    dbUtils.addInOutInfos(carNumber, postData).then(function () {
      res.send({
        result: true,
        message: "New info added for car(Number:".concat(carNumber, ")!")
      });
    })["catch"](function (err) {
      res.send({
        result: false,
        message: err.message
      });
    });
  } catch (error) {
    res.send({
      result: false,
      message: error.message
    });
  }
});
app.post("/cars/:carNumber/update/info/:infoId", function (req, res) {
  var _req$params = req.params,
    carNumber = _req$params.carNumber,
    infoId = _req$params.infoId;
  var postData = req.body;
  postData.who_out_checked = req.session.user;
  try {
    dbUtils.updateInOutInfos(carNumber, infoId, postData).then(function (count) {
      res.send({
        result: true,
        message: "Info(Id: ".concat(infoId, ") updated!")
      });
    })["catch"](function (error) {
      res.send({
        result: false,
        message: error.message
      });
    });
  } catch (error) {
    res.send({
      result: false,
      message: error.message
    });
  }
});
app.post("/cars/:carNumber/update1c/info/:infoId", function (req, res) {
  var _req$params2 = req.params,
    carNumber = _req$params2.carNumber,
    infoId = _req$params2.infoId;
  var postData = req.body;
  postData.who_sent_to_1c = req.session.user;
  try {
    dbUtils.update1cInOutInfos(carNumber, infoId, postData).then(function (count) {
      res.send({
        result: true,
        message: "Info(Id: ".concat(infoId, ") updated!")
      });
    })["catch"](function (error) {
      res.send({
        result: false,
        message: error.message
      });
    });
  } catch (error) {
    res.send({
      result: false,
      message: error.message
    });
  }
});
app.post("/cars/:number/infos", function (req, res) {
  var number = req.params.number;
  var filters = req.body;
  console.log("Car's ID:", number);
  try {
    Cars.query().findById(number).then(function (car) {
      if (!car) {
        res.status(200).send({
          result: false,
          message: "Invalid car number: " + number
        });
      } else {
        var q = car.$relatedQuery("infos");
        if (filters) {
          dbUtils.setFilters(q, filters);
        }
        console.log(q.toKnexQuery().toQuery());
        q.then(function (infos) {
          if (infos.length) {
            car.infos = infos;
          } else {
            console.warn("Infos not found for car: " + number);
          }
          res.status(200).send({
            result: true,
            car: car
          });
        })["catch"](function (err) {
          res.status(200).send({
            result: false,
            message: err
          });
        });
        // .finally(() => {
        //     res.status(200).send({ result: true, car: car });
        // })
      }
    });
  } catch (error) {
    Dres.status(500).send({
      result: false,
      message: error.message
    });
  }
});
app.post("/cars/:number/infos/:ioInfosId", function (req, res) {
  var _req$params3 = req.params,
    number = _req$params3.number,
    ioInfosId = _req$params3.ioInfosId;
  console.log("Car's ID:", number);
  console.log("IoInfo's ID:", ioInfosId);
  try {
    Cars.query().findById(number).then(function (car) {
      if (!car) {
        res.status(200).send({
          result: false,
          message: "Invalid car number: " + number
        });
      } else {
        var filters = req.body;
        var q = car.$relatedQuery("infos").findById(ioInfosId);
        if (filters) {
          dbUtils.setFilters(q, filters);
        }
        q.then(function (info) {
          if (info) {
            car.info = info;
          }
        })["finally"](function () {
          res.status(200).send({
            result: true,
            car: car
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      result: false,
      message: error.message
    });
  }
});
app.post("/reports/infos/from/:dateFrom/to/:dateTo", function (req, res) {
  var _req$params4 = req.params,
    dateFrom = _req$params4.dateFrom,
    dateTo = _req$params4.dateTo;
  var filters = req.body;
  try {
    var q = InOutInfo.query();
    if (filters) {
      dbUtils.setFilters(q, filters);
    }
    q.whereBetween("date_ymd", [dateFrom, dateTo]);
    console.log(q.toKnexQuery().toQuery());
    q.then(function (infos) {
      res.send({
        result: true,
        infos: infos
      });
    });
  } catch (error) {
    res.status(500).send({
      result: false,
      message: error.message
    });
  }
});
var pugViews = path.resolve(__dirname, "..", "utils", "views");
console.log("Pug views path:", pugViews);
app.set("views", pugViews);
app.set("view engine", "pug");
app.get("/reports/info/:infoId", function (req, res) {
  var infoId = req.params.infoId;
  // res.send(utils.getFullInfoReport(infoId));
  try {
    InOutInfo.query().findById(infoId).then(function (info) {
      info.$relatedQuery('photos').then(function (photos) {
        if (photos) {
          photos.forEach(function (photo) {
            photo.imageUrl = "/" + commonUtils.getImageAccessUrl(info.car_number, photo.url, info.date_ymd);
          });
          res.render("fullInfoReport", {
            info: info,
            photos: photos
          });
        } else {
          res.render("fullInfoReport", {
            title: "Hey",
            message: "Hello there!",
            info: info
          });
        }
      });
    });
  } catch (error) {
    res.send(error.toString());
  }
});
app.post("/cars/:number/infos/:ioInfosId/photos", function (req, res) {
  var _req$params5 = req.params,
    number = _req$params5.number,
    ioInfosId = _req$params5.ioInfosId;
  console.log("Car's ID:", number);
  console.log("IoInfo's ID:", ioInfosId);
  try {
    Cars.query().findById(number).then(function (car) {
      if (!car) {
        res.status(200).send({
          result: false,
          message: "Invalid car number: " + number
        });
      } else {
        car.$relatedQuery("infos").findById(ioInfosId).then(function (ioInfo) {
          if (ioInfo) {
            var q = ioInfo.$relatedQuery("photos");
            var filters = req.body;
            if (filters) {
              dbUtils.setFilters(q, filters);
            }
            q.then(function (photos) {
              if (photos) {
                car.photos = photos;
              }
            })["finally"](function () {
              res.status(200).send({
                result: true,
                car: car
              });
            });
          } else {
            res.send({
              result: false,
              message: "Photos not found for car number(".concat(number, ") and infoId(").concat(ioInfosId, ")!")
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      result: false,
      message: error.message
    });
  }
});

// ... to photos
var path2Photos = path.resolve(__dirname, "..", "..", "dist", "photos");
app.post("/getStreetCameraImage", function (request, response) {
  var carNumber = request.body.carNumber;
  var infoId = request.body.infoId;
  var forDate = request.body.forDate;
  var cameraIp = request.body.cameraIp;
  var carState = request.body.carState;
  if (!carNumber || !infoId || !forDate || !cameraIp || !carState) {
    response.status(400).send({
      result: false,
      message: "Parameters are not properly defined!"
    });
    return;
  }
  console.log("Get street camera image:");
  console.log(" ...      for carNumber:", carNumber);
  console.log(" ...           for date:", forDate);
  console.log(" ...     with car state:", carState);
  console.log(" ...     from camera IP:", cameraIp);
  var myPath = utils.getImagesDirectoryPath(path2Photos, carNumber, forDate);
  if (utils.validateDir(myPath)) {
    var myFile = utils.getUniqueId(null, request.body.carState) + ".jpeg";
    var myPath2File = path.join(myPath, myFile);
    var imageUrl = os.hostname() !== "1ctest1" ? "https://via.placeholder.com/1200x800/" + (carState.indexOf("In") == 0 ? "008000" : "0000FF") + "/808080.JPEG?text=OLC+KPP+Test-Image\n" + myFile : "http://kpp:Kpp_1234@" + cameraIp + "/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG";
    downloadImageFromURL(imageUrl, myPath2File, function () {
      console.log("done");
    }).then(function () {
      dbUtils.isIoInfoExists(infoId).then(function (ioInfo) {
        if (ioInfo) {
          dbUtils.addPhoto4ioInfoId(infoId, {
            url: myFile
          }).then(function (photo) {
            response.send({
              result: true,
              photo: photo
            });
          })["catch"](function (err) {
            response.send({
              result: false,
              message: err
            });
          });
        } else {
          response.send({
            result: false,
            message: "Invalid parent ioIdoId: " + infoId
          });
        }
      });
    })["catch"](function (err) {
      return response.send({
        result: false,
        message: err
      });
    });
  } else {
    console.log("Couldn't validate path: " + myPath);
    response.send({
      result: false,
      errMessage: "Couldn't validate path: " + myPath
    });
  }
});

// ############### Web service part
function downloadImageFromURL(_x, _x2, _x3) {
  return _downloadImageFromURL.apply(this, arguments);
}
function _downloadImageFromURL() {
  _downloadImageFromURL = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(url, path, callback) {
    var writer, controller, timeout, response;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log("Image from url: " + url);
          console.log(" ... we going to saved as: " + path);
          writer = Fs.createWriteStream(path);
          controller = new AbortController();
          timeout = setTimeout(function () {
            controller.abort();
            // Timeout Logic
          }, 2500); // 3 seconds till timeout
          _context.next = 7;
          return Axios({
            url: url,
            method: "GET",
            responseType: "stream",
            signal: controller.signal
          });
        case 7:
          response = _context.sent;
          response.data.pipe(writer);
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            writer.on("end", resolve(path));
            writer.on("error", reject());
            writer.on("close", clearTimeout(timeout));
          }));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _downloadImageFromURL.apply(this, arguments);
}
module.exports = app;