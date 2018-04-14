const log4js = require('log4js');
const path = require("path");
const logLevel = process.env.NODE_ENV != "development" ? "info" : "trace";

exports.start = function (project_name) {
    var dateFileLogger = {};
    dateFileLogger.type = 'dateFile';
    dateFileLogger.filename = path.join(__dirname, "../logs", project_name);
    dateFileLogger.pattern = '-yyyy-MM-dd.log';
    dateFileLogger.compress = false;
    dateFileLogger.category = project_name;
    dateFileLogger.maxLogSize = 2048000;
    dateFileLogger.backups = 10;

    var appenders = {};
    appenders.console = { type: 'console' };
    appenders[project_name] = dateFileLogger;
    log4js.configure({
        appenders: appenders,
        categories: {
            default: {
                appenders: [ 'console', project_name ],
                level: logLevel
            }
        }
    });

    var fileLogger = log4js.getLogger(project_name);
    return fileLogger;
}
