'use strict';

const e = require("express");

const LEVEL_ALL = 0;
const LEVEL_REGISTERED = 1;
const LEVEL_1C = 2;
const LEVEL_KPP = 3;
const LEVEL_ADMIN = 4;
const LEVEL_UKNOWN_REQUEST = 999;
const LEVEL_UKNOWN_USER = -999;
const LEVELS = ['ALL', 'REGISTERED', '1C', 'KPP', 'ADMIN'];

const reRoot = /^\/$/;
const reAll = /^\/(assets|checkLogin|favicon|login|logout|checkLogin)/;
const reRegistered = /^\/(getImages|changePassword)/;
const re1C = /^\/cars/
const re1Kpp = /^\/(base64Jpeg2File|getCameraImage)/
const reAdmin = /^\/(getAllUsers|getRoles|changeRole4User|addUser|updateUser|checkLogin)/;

function getRequestLevel(url) {
    if (reRoot.test(url) || reAll.test(url)) {
        return LEVEL_ALL;
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

function getUserLevel(role) {
    if (!role) {
        return LEVEL_ALL;
    } else if (role === 'registered') {
        return LEVEL_REGISTERED;
    } else if (role === '1c') {
        return LEVEL_1C;
    } else if (role === 'kpp') {
        return LEVEL_KPP;
    } else if (role === 'admin') {
        return LEVEL_ADMIN;
    } 
    return LEVEL_UKNOWN_USER;
}

module.exports = (req, res, next) => {
    const roUrl = req.originalUrl;
    const requestLevel = getRequestLevel(roUrl)
    const userLevel = getUserLevel(req.session.userRole)

    if (requestLevel > userLevel) {
        console.log("AUTH:URL:", req.originalUrl)
        console.log("AUTH:USER:", req.session.user)
        console.log("AUTH:USERROLE:", req.session.userRole)
        console.warn('INVALID ACCESS LEVEL:', 'Request level -', requestLevel, 'User level -', userLevel);
        res.send({ result: false, message: "INVALID ACCESS LEVEL!" })
    } else {
        return next();
    }
};

