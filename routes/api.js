const express = require('express');
const router = express.Router();
const uuid = require('node-uuid');
const fs = require('fs');
const mkdirp = require('mkdirp');
const db = require("../services/bigchaindb.js");
const path = require('path');

router.use(function (req, res, next) {
    next();
});

router.post('/create', function (req, res) {
    const image = req.files.image;
    if (image.size > 0 && fs.existsSync(image.path)) {
        var oriFilename = image.originalFilename;
        const ext = path.extname(oriFilename);
        const basename = path.basename(oriFilename, ext);
        const uploadName = uuid.v4() + ext;
        fs.createReadStream(image.path).pipe(fs.createWriteStream(path.join(__dirname, '../data' , uploadName)));
        fs.unlinkSync(image.path);
        req.body.image = uploadName;
    }
    db.create(req.body)
    .then(retrievedTx => {
        const ret = {};
        ret.resultFlag = true;
        ret.resultMsg = 'success';
        res.set('Content-Type', 'text/json');
        res.send(ret);
    })
    .catch(err => {
        ret = {};
        ret.resultFlag = false;
        ret.resultMsg = 'fail';
        res.set('Content-Type', 'text/json');
        res.send(ret);
    });
});


router.get('/read', function (req, res) {
    db.read(req.query.search)
    .then(retrievedTx => res.send(retrievedTx))
    .catch(err => res.send(err));
});
module.exports = router;