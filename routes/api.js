const express = require('express');
const router = express.Router();
const uuid = require('node-uuid');
const fs = require('fs');
const mkdirp = require('mkdirp');
const db = require("../services/bigchaindb.js");

router.use(function (req, res, next) {
    next();
});

router.post('/create', function (req, res) {
    db.create(req.body)
    .then(retrievedTx => {
        const ret = {};
        ret.resultFlag = true;
        ret.resultMsg = 'success';
        res.set('Content-Type', 'text/json');
        res.send(ret);
    });
});

module.exports = router;