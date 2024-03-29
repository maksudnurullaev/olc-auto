const utils = require("../utils/utils.js");
const commonUtils = require("../utils/common");
const express = require("express");
const WS_NAME = "OLC-KPP API Web-Service version";
const WS_VERSION = "0.0.1b";
const path = require("path");
const Fs = require("fs");
const Axios = require("axios");
const app = express();
const authUtils = require("./auth/utils");
const myCrypto = require("./crypto");
const dbUtils = require("./knex/utils");
const wsUtils = require("./utils/ws");
const os = require("os");

// Patch limit of size upload image
app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// express & session & auth
//   ... i.e.: https://www.codexpedia.com/node-js/a-very-basic-session-auth-in-node-js-with-express-js/
const session = require("express-session");
if (utils.isDevEnvironment() || utils.isTestEnvironment()) {
  // DEV || TEST
  app.use(
    session({
      secret: "WppQ38S-4D44-2C44",
      resave: true,
      saveUninitialized: true,
    })
  );
} else {
  // PRODUCTION
  const sqlite = require("better-sqlite3");
  const SqliteStore = require("better-sqlite3-session-store")(session);
  const db = new sqlite(path.join("dist", "db", "sessions.db"));

  app.use(
    session({
      secret: "WppQ38S-4D44-2C44",
      resave: true,
      saveUninitialized: true,
      store: new SqliteStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 3600000, //ms = 60min
        },
      }),
    })
  );
}

// ... casl
const casl = require("./casl");
app.use(casl.auth);
// ###############################################

app.post("/changeRole4User", function (req, res) {
  const postData = req.body;
  console.log("Going to chage user access role:", postData);
  if (!postData.userId || !postData.roleId) {
    res.send({
      result: false,
      message: "Invalid fields definitions to change user role!",
    });
  } else {
    dbUtils
      .changeRole4User(postData)
      .then(() => {
        res.send({ result: true, message: "User role changed!" });
      })
      .catch((err) => {
        res.send({ result: false, message: err });
      });
  }
});

app.post("/getAllUsers", function (req, res) {
  console.log("Going to get all users");
  const _result = [];
  const _promises = [];
  dbUtils
    .getAllUsers(["id", "description", "phone", "rowid"])
    .then((users) => {
      users.forEach((user) => {
        _promises.push(
          new Promise((resolve, reject) => {
            authUtils.getRoles(user).then((roles) => {
              const _user = user.toJSON();
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
          })
        );
      });
      return Promise.all(_promises);
    })
    .then(() => {
      res.send({ result: true, users: _result });
    })
    .catch((err) => {
      res.send({ result: false, message: err });
    });
});

app.post("/getRoles", function (req, res) {
  dbUtils
    .getRoles()
    .then((roles) => {
      res.send({ result: true, roles });
    })
    .catch((err) => {
      res.send({ result: false, message: err });
    });
});

app.post("/getTransportTypes", function (req, res) {
  dbUtils
    .getTransportTypes()
    .then((ttypes) => {
      res.send({ result: true, transportTypes: ttypes });
    })
    .catch((err) => {
      res.send({ result: false, message: err });
    });
});

app.post("/updateUser", function (req, res) {
  console.log("Going to update user data");
  const userData = req.body;
  authUtils
    .updateUser(userData)
    .then((user) => {
      User.query()
        .select(["id", "phone", "description", "rowid"])
        .where("rowid", userData.rowid)
        .then((user) => {
          res.send({
            result: true,
            user,
            message: "Пользователь обновлен успешно!",
          });
        })
        .catch((err) => {
          res.send({ result: false, message: err });
        });
    })
    .catch((err) => {
      if (err && err.code == "SQLITE_CONSTRAINT_PRIMARYKEY") {
        res.send({
          result: false,
          message: "Такой пользователь уже существует в базе данных!",
        });
      } else {
        console.error(err);
        res.send({ result: false, message: "Ошибка базы данных или сервера!" });
      }
    });
});

app.post("/addUser", function (req, res) {
  console.log("Going to add user");
  const userData = req.body;
  authUtils
    .addNewUserData(userData)
    .then((user) => {
      res.send({
        result: true,
        message: "Новый пользователь системы [" + user.id + "] создан успешно!",
      });
    })
    .catch((err) => {
      if (err && err.code == "SQLITE_CONSTRAINT_PRIMARYKEY") {
        res.send({
          result: false,
          message: "Такой пользователь уже существует в базе данных!",
        });
      } else {
        console.error(err);
        res.send({ result: false, message: "Ошибка базы данных или сервера!" });
      }
    });
});

app.post("/checkLogin", function (req, res) {
  if (req.session && req.session.user) {
    res.send({
      result: true,
      message: "login already done!",
      user: { id: req.session.user, role: req.session.userRole },
    });
  } else {
    res.send({
      result: false,
      message: "no-login!",
      user: { id: "", role: "" },
    });
  }
});

app.post("/changePassword", function (req, res) {
  console.log("Going to change user password!");
  if (!req.body.userId || !req.body.newUserPassword) {
    res.send({
      result: false,
      message: "Не заполнено поле пользователя или пароля!",
    });
  } else {
    const userId = req.body.userId;
    const userPassword = req.body.newUserPassword;
    User.query()
      .findById(userId)
      .patch({
        hashedPassword: myCrypto.hashUserAndPassword(userId, userPassword),
      })
      .then(() => {
        console.log("User password successfully changed!");
        res.send({
          result: true,
          message: "Password changed!",
        });
      })
      .catch((err) => {
        res.send({
          result: false,
          message: err.toString(),
        });
      });
  }
});

app.post("/login", function (req, res) {
  const userId = req.body.id;
  const userPassword = req.body.password;
  if (!userId || !userPassword) {
    res.send({
      result: false,
      message: "Не заполнено поле пользователя или пароля!",
    });
  } else if (userId === "admin") {
    authUtils.isUserExists("admin").then((user) => {
      if (!user) {
        wsUtils.loginAdminNew(userPassword, req, res);
      } else {
        wsUtils.loginUser(user, req.body.password, req, res);
      }
    });
  } else {
    authUtils.isUserExists(userId).then((user) => {
      if (user) {
        wsUtils.loginUser(user, userPassword, req, res);
      } else {
        res.send({
          result: false,
          message: "User not found!",
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
    user: { id: "", role: "" },
  });
});

function getModuleInfo() {
  return WS_NAME + ": " + WS_VERSION;
}

// TODO: downloadImageFromURL('http://kpp:Kpp_1234@192.168.4.150/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG', 'kpp.jpeg');
app.get("/", (request, response) => {
  response.sendFile(
    path.resolve(__dirname, "..", "..", "dist", "front", "index.html")
  );
});

// get objection's Cars
const Cars = require("./knex/models/Car");
const User = require("./knex/models/User.js");
const InOutInfo = require("./knex/models/InOutInfo.js");
const { raw } = require("objection");
app.post("/cars", (request, response) => {
  const filters = request.body;
  const q = Cars.query();
  if (filters) {
    dbUtils.setFilters(q, filters);
  }
  q.then((cars) => {
    console.log("Found", cars.length, "cars");
    response.json({ result: true, cars });
  });
});

app.post("/cars/like/:partNumber", (req, res) => {
  const { partNumber } = req.params;
  const partNumberLike = `%${partNumber}%`;
  console.log("Looking for cars like:", partNumberLike);
  try {
    let q = Cars.query()
      .select("number")
      .where(raw("number like ?", [partNumberLike]));
    console.log(q.toKnexQuery().toQuery());
    q.then((cars) => {
      if (cars.length) {
        res.status(200).send({ result: true, cars: cars });
      } else {
        res.status(200).send({
          result: false,
          message: "No cars foud for part of number: " + partNumber,
        });
      }
    });
  } catch (error) {
    res.status(500).send({ result: false, message: error.message });
  }
});

app.post("/cars/:number", (req, res) => {
  const { number } = req.params;
  console.log("Car's ID:", number);
  try {
    Cars.query()
      .findById(number)
      .then((car) => {
        if (!car) {
          res
            .status(200)
            .send({ result: false, message: "Invalid car number: " + number });
        } else {
          res.status(200).send({ result: true, car });
        }
      });
  } catch (error) {
    res.status(500).send({ result: false, message: error.message });
  }
});

app.post("/cars/:carNumber/add/info", function (req, res) {
  const { carNumber } = req.params;
  const postData = req.body;
  postData.who_in_checked = req.session.user;
  postData.date_ymd = utils.ymdFormateDate();

  try {
    dbUtils
      .addInOutInfos(carNumber, postData)
      .then(() => {
        res.send({
          result: true,
          message: `New info added for car(Number:${carNumber})!`,
        });
      })
      .catch((err) => {
        res.send({ result: false, message: err.message });
      });
  } catch (error) {
    res.send({ result: false, message: error.message });
  }
});

app.post("/cars/:carNumber/update/info/:infoId", function (req, res) {
  const { carNumber, infoId } = req.params;
  const postData = req.body;
  postData.who_out_checked = req.session.user;

  try {
    dbUtils
      .updateInOutInfos(carNumber, infoId, postData)
      .then((count) => {
        res.send({ result: true, message: `Info(Id: ${infoId}) updated!` });
      })
      .catch((error) => {
        res.send({ result: false, message: error.message });
      });
  } catch (error) {
    res.send({ result: false, message: error.message });
  }
});

app.post("/cars/:carNumber/update1c/info/:infoId", function (req, res) {
  const { carNumber, infoId } = req.params;
  const postData = req.body;
  postData.who_sent_to_1c = req.session.user;

  try {
    dbUtils
      .update1cInOutInfos(carNumber, infoId, postData)
      .then((count) => {
        res.send({ result: true, message: `Info(Id: ${infoId}) updated!` });
      })
      .catch((error) => {
        res.send({ result: false, message: error.message });
      });
  } catch (error) {
    res.send({ result: false, message: error.message });
  }
});

app.post("/cars/:number/infos", (req, res) => {
  const { number } = req.params;
  const filters = req.body;

  console.log("Car's ID:", number);
  try {
    Cars.query()
      .findById(number)
      .then((car) => {
        if (!car) {
          res
            .status(200)
            .send({ result: false, message: "Invalid car number: " + number });
        } else {
          const q = car.$relatedQuery("infos");
          if (filters) {
            dbUtils.setFilters(q, filters);
          }
          console.log(q.toKnexQuery().toQuery());
          q.then((infos) => {
            if (infos.length) {
              car.infos = infos;
            } else {
              console.warn("Infos not found for car: " + number);
            }
            res.status(200).send({ result: true, car });
          }).catch((err) => {
            res.status(200).send({ result: false, message: err });
          });
          // .finally(() => {
          //     res.status(200).send({ result: true, car: car });
          // })
        }
      });
  } catch (error) {
    Dres.status(500).send({ result: false, message: error.message });
  }
});

app.post("/cars/:number/infos/:ioInfosId", (req, res) => {
  const { number, ioInfosId } = req.params;

  console.log("Car's ID:", number);
  console.log("IoInfo's ID:", ioInfosId);
  try {
    Cars.query()
      .findById(number)
      .then((car) => {
        if (!car) {
          res
            .status(200)
            .send({ result: false, message: "Invalid car number: " + number });
        } else {
          const filters = req.body;
          const q = car.$relatedQuery("infos").findById(ioInfosId);
          if (filters) {
            dbUtils.setFilters(q, filters);
          }
          q.then((info) => {
            if (info) {
              car.info = info;
            }
          }).finally(() => {
            res.status(200).send({ result: true, car });
          });
        }
      });
  } catch (error) {
    res.status(500).send({ result: false, message: error.message });
  }
});

app.post("/reports/infos/from/:dateFrom/to/:dateTo", (req, res) => {
  const { dateFrom, dateTo } = req.params;
  const filters = req.body;
  try {
    const q = InOutInfo.query();
    if (filters) {
      dbUtils.setFilters(q, filters);
    }
    q.whereBetween("date_ymd", [dateFrom, dateTo]);
    console.log(q.toKnexQuery().toQuery());
    q.then((infos) => {
      res.send({ result: true, infos });
    });
  } catch (error) {
    res.status(500).send({ result: false, message: error.message });
  }
});

const pugViews = path.resolve(__dirname, "..", "utils", "views");
console.log("Pug views path:", pugViews);
app.set("views", pugViews);
app.set("view engine", "pug");
app.get("/reports/info/:infoId", (req, res) => {
  const { infoId } = req.params;
  // res.send(utils.getFullInfoReport(infoId));
  try {
    InOutInfo.query()
      .findById(infoId)
      .then((info) => {
        info.$relatedQuery('photos').then((photos) => {
          if( photos ){
            photos.forEach((photo) => {
              photo.imageUrl = "/" + commonUtils.getImageAccessUrl(info.car_number, photo.url, info.date_ymd)
            });
            res.render("fullInfoReport", {
              info,
              photos
            });    

          } else {
            res.render("fullInfoReport", {
              title: "Hey",
              message: "Hello there!",
              info: info,
            });    
          }
        })
      });
  } catch (error) {
    res.send(error.toString());
  }
});

app.post("/cars/:number/infos/:ioInfosId/photos", (req, res) => {
  const { number, ioInfosId } = req.params;
  console.log("Car's ID:", number);
  console.log("IoInfo's ID:", ioInfosId);
  try {
    Cars.query()
      .findById(number)
      .then((car) => {
        if (!car) {
          res
            .status(200)
            .send({ result: false, message: "Invalid car number: " + number });
        } else {
          car
            .$relatedQuery("infos")
            .findById(ioInfosId)
            .then((ioInfo) => {
              if (ioInfo) {
                const q = ioInfo.$relatedQuery("photos");
                const filters = req.body;
                if (filters) {
                  dbUtils.setFilters(q, filters);
                }
                q.then((photos) => {
                  if (photos) {
                    car.photos = photos;
                  }
                }).finally(() => {
                  res.status(200).send({ result: true, car });
                });
              } else {
                res.send({
                  result: false,
                  message: `Photos not found for car number(${number}) and infoId(${ioInfosId})!`,
                });
              }
            });
        }
      });
  } catch (error) {
    res.status(500).send({ result: false, message: error.message });
  }
});

// ... to photos
const path2Photos = path.resolve(__dirname, "..", "..", "dist", "photos");
const configOrgs = require("../utils/Organizations.json");
const { getImageAccessUrl } = require("../utils/common.js");
app.post("/getStreetCameraImageV2/:org/:kpp/:camera/", (request, response) => {
  const { org, kpp, camera } = request.params;
  if (configOrgs.orgs) {
    const orgs = configOrgs.orgs;
    if (!orgs[org]) {
      response
        .status(200)
        .send({ result: false, message: "Invalid org: " + org });
      console.log(org);
      return;
    } else if (!orgs[org]["kpps"] || !orgs[org]["kpps"][kpp]) {
      response.status(200).send({
        result: false,
        message: "Invalid kpps or kpp: " + kpp + " for org: " + org,
      });
      return;
    } else if (
      !orgs[org]["kpps"][kpp]["cameras"] ||
      !orgs[org]["kpps"][kpp]["cameras"][camera]
    ) {
      response.status(200).send({
        result: false,
        message:
          "Invalid camera: " +
          camera +
          " for kpp: " +
          kpp +
          " and for org: " +
          org,
      });
      return;
    } else {
      const path2TempDir = path.join(path2Photos, "temp");
      if (!utils.validateDir(path2TempDir)) {
        response.status(200).send({
          result: false,
          message: "Invalid temp directory for test photos: " + path2TempDir,
        });
      } else {
        const photoFile = utils.getUniqueId([kpp, camera].join("-")) + ".jpeg";
        const path2TestPhotoFile = path.join(path2TempDir, photoFile);
        const imageUrl =
          os.hostname() !== "1ctest1"
            ? "https://via.placeholder.com/1200x800/" +
              (camera.indexOf("In") == 0 ? "008000" : "0000FF") +
              "/808080.JPEG?text=OLC+KPP+Test-Image\n" +
              photoFile
            : orgs[org]["kpps"][kpp]["cameras"][camera]["url"];
        console.log("Try to get image from url:", path2TestPhotoFile);
        // const imageUrlTest = 'https://images.unsplash.com/photo-1506812574058-fc75fa93fead';
        downloadImageFromURL(imageUrl, path2TestPhotoFile)
          .then(() => {
            response.status(200).send({
              result: true,
              message: "/" + ["photos", "temp", photoFile].join("/"),
            });
          })
          .catch((err) => {
            response.status(200).send({
              result: false,
              message: err,
            });
          });
      }
      return;
    }
  } else {
    console.log("Invalid organizations definition!");
    response
      .status(200)
      .send({ result: false, message: "Invalid organizations definition!" });
  }
});

app.post("/getStreetCameraImage", (request, response) => {
  const carNumber = request.body.carNumber;
  const infoId = request.body.infoId;
  const forDate = request.body.forDate;
  const cameraIp = request.body.cameraIp;
  const carState = request.body.carState;
  if (!carNumber || !infoId || !forDate || !cameraIp || !carState) {
    response
      .status(400)
      .send({ result: false, message: "Parameters are not properly defined!" });
    return;
  }
  console.log("Get street camera image:");
  console.log(" ...      for carNumber:", carNumber);
  console.log(" ...           for date:", forDate);
  console.log(" ...     with car state:", carState);
  console.log(" ...     from camera IP:", cameraIp);
  const myPath = utils.getImagesDirectoryPath(path2Photos, carNumber, forDate);
  if (utils.validateDir(myPath)) {
    const myFile = utils.getUniqueId(null, request.body.carState) + ".jpeg";
    const myPath2File = path.join(myPath, myFile);

    const imageUrl =
      os.hostname() !== "1ctest1"
        ? "https://via.placeholder.com/1200x800/" +
          (carState.indexOf("In") == 0 ? "008000" : "0000FF") +
          "/808080.JPEG?text=OLC+KPP+Test-Image\n" +
          myFile
        : "http://kpp:Kpp_1234@" +
          cameraIp +
          "/ISAPI/Streaming/channels/101/picture?snapShotImageType=JPEG";

    downloadImageFromURL(imageUrl, myPath2File, () => {
      console.log("done");
    })
      .then(() => {
        dbUtils.isIoInfoExists(infoId).then((ioInfo) => {
          if (ioInfo) {
            dbUtils
              .addPhoto4ioInfoId(infoId, { url: myFile })
              .then((photo) => {
                response.send({ result: true, photo });
              })
              .catch((err) => {
                response.send({ result: false, message: err });
              });
          } else {
            response.send({
              result: false,
              message: "Invalid parent ioIdoId: " + infoId,
            });
          }
        });
      })
      .catch((err) => response.send({ result: false, message: err }));
  } else {
    console.log("Couldn't validate path: " + myPath);
    response.send({
      result: false,
      errMessage: "Couldn't validate path: " + myPath,
    });
  }
});

// ############### Web service part

async function downloadImageFromURL(url, path, callback) {
  console.log("Image from url: " + url);
  console.log(" ... we going to saved as: " + path);
  const writer = Fs.createWriteStream(path);

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
    // Timeout Logic
  }, 2500); // 3 seconds till timeout

  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
    signal: controller.signal,
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("end", resolve(path));
    writer.on("error", reject());
    writer.on("close", clearTimeout(timeout));
  });
}

module.exports = app;
