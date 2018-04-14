var express = require('express');
var cors = require('cors');
var router = express.Router();
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var mkdirp = require('mkdirp');
var log4js_wrapper = require('./utils/log4js_wrapper.js');
require('date-utils');

// load config
global.PROJECT_CONFIG = require('./config/projectConfig.json');

var fileLogger = log4js_wrapper.start(global.PROJECT_CONFIG.name);
global.LOG = fileLogger;

var app = express();

var httpLogger = morgan('tiny', { skip: function (req, res) { return res.statusCode < 400; }, stream: { write: function (str) { fileLogger.debug(str.trim()); } } });
app.use(httpLogger);

app.use(session({
    secret: uuid.v1(),
    name: global.PROJECT_CONFIG.name,
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: false, parameterLimit: 1000 }));
app.use(multipart());
app.use(cors({
    origin: ['http://localhost:3001','http://localhost:3006','http://localhost:8080']
}));

// 시작 기준 페이지
router.get('/', function (req, res, next) {
    req.session.destroy(function (err) {
        if (!err) {
            res.sendFile(path.join(__dirname+'/public/index.html'));
        }
    });
});

app.use('/', router);
app.use('/api', require('./routes/api.js'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    global.LOG.debug('Express server has started on port ' + port);
});

server.timeout = 600000;

process.on('uncaughtException', function (err) {
    //예상치 못한 예외 처리
    global.LOG.error(err);
});