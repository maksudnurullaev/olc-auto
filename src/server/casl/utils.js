"use strict";

const LEVEL_NOT_REGISTERED = 0;
exports.LEVEL_NOT_REGISTERED = LEVEL_NOT_REGISTERED;

const LEVEL_REGISTERED = 1;
exports.LEVEL_REGISTERED = LEVEL_REGISTERED;

const LEVEL_1C = 2;
exports.LEVEL_1C = LEVEL_1C;

const LEVEL_KPP = 3;
exports.LEVEL_KPP = LEVEL_KPP;

const LEVEL_ADMIN = 4;
exports.LEVEL_ADMIN = LEVEL_ADMIN;

const LEVEL_UKNOWN_REQUEST = 999;
const LEVEL_UKNOWN_USER = -999;
const LEVELS = ["NOT_REGISTERED", "REGISTERED", "1C", "KPP", "ADMIN"];

const reRoot = /^\/$/;
const reAll = /^\/(assets|favicon|login|logout|checkLogin|kpp|reports)/;
// const reAll = /^\/(assets|favicon|login|logout|checkLogin)/;
const reRegistered = /^\/changePassword/;
const re1C = /^\/(car|getImages|photos|getTransportTypes|)/;
const re1Kpp = /^\/(base64Jpeg2File|getStreetCameraImage|base64Jpeg2File)/;
const reAdmin = /^\/(getAllUsers|getRoles|changeRole4User|addUser|updateUser)/;

function hasAccess(req) {
  if (!req) {
    console.error("Invalid request to define user permission!");
    return false;
  }

  const requestLevel = getRequestLevel(req.originalUrl);
  const userLevel = getUserLevel(req.session.userRole);
  console.log(
    "AUTH: URL:",
    req.originalUrl,
    "USER:",
    req.session.user,
    "with ROLE:",
    req.session.userRole,
    (requestLevel > userLevel) ? "FAIL!" : "OK"
  );
  if (requestLevel > userLevel) {
    console.warn(
      "INVALID ACCESS LEVEL:",
      "Request level -",
      getLevelInfo(requestLevel),
      ", but User level -",
      getLevelInfo(userLevel)
    );
    return false;
  }
  return true;
}
exports.hasAccess = hasAccess;

function getLevelInfo(level) {
  return LEVELS.length > level ? LEVELS[level] : level;
}
exports.getLevelInfo = getLevelInfo;

function getRequestLevel(url) {
  if (reRoot.test(url) || reAll.test(url)) {
    return LEVEL_NOT_REGISTERED;
  } else if (reRegistered.test(url)) {
    return LEVEL_REGISTERED;
  } else if (re1C.test(url)) {
    return LEVEL_1C;
  } else if (re1Kpp.test(url)) {
    return LEVEL_KPP;
  } else if (reAdmin.test(url)) {
    return LEVEL_ADMIN;
  }
  return LEVEL_UKNOWN_REQUEST;
}
exports.getRequestLevel = getRequestLevel;

function getUserLevel(role) {
  if (!role) {
    return LEVEL_NOT_REGISTERED;
  } else if (role === "registered") {
    return LEVEL_REGISTERED;
  } else if (role === "1c") {
    return LEVEL_1C;
  } else if (role === "kpp") {
    return LEVEL_KPP;
  } else if (role === "admin") {
    return LEVEL_ADMIN;
  }
  return LEVEL_UKNOWN_USER;
}
exports.getUserLevel = getUserLevel;
