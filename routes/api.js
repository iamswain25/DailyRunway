var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var fs = require('fs');
var mkdirp = require('mkdirp');


router.use(function (req, res, next) {
    next();
});

router.post('/stats', function (req, res) {
    var ret = {};
    ret.resultFlag = true;
    ret.resultMsg = 'success';
    res.set('Content-Type', 'text/json');
    res.send(ret);
});

module.exports = router;