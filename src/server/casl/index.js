'use strict';

const caslUtils = require('./utils');

function auth(req, res, next) {
    if (!caslUtils.hasAccess(req)) {
        res.send({ result: false, message: "INVALID ACCESS LEVEL!" })
    } else {
        return next();
    }
};
exports.auth = auth;

