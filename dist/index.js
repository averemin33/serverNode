import express from 'express';
import config from 'config';
import log4js from 'log4js';
const PORT = config.get('serverPort') || 5000;
const app = express();
const logger = log4js.getLogger();
logger.level = 'debug';
logger.debug('info log4js');
const start = () => {
    app.listen(PORT, () => {
        console.log(`running on port: ${PORT}!`);
    });
};
start();
//# sourceMappingURL=index.js.map