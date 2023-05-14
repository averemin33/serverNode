import cookie from 'cookie-parser';
import config from 'config';
import log4js from 'log4js';
import express, { Express } from 'express';
import { sequelize } from './bd.js';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './controllers/index.js';
import bodyParser from 'body-parser';
import httpContext from 'express-http-context';
import cors from 'cors';
import { MiddlewateError } from './middlewares/index.js';
import mapping from './models/mapping.js';

const PORT = config.get('serverPort') || 5000;
const logger = log4js.getLogger();
logger.level = 'debug';

const app: Express = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Accept-Version', 'Authorization', 'Credentials', 'Content-Type'],
  }),
);
app.use(bodyParser.json());
app.use(httpContext.middleware);
app.use(cookie(config.get('secretKey')));
useExpressServer(app, {
  controllers: [UserController],
  middlewares: [MiddlewateError],
  defaultErrorHandler: false,
});
app.post('/api', (request, response) => {
  logger.info({ ...request.body });
  return response.json('ok');
});

const start = () => {
  sequelize.sync();
  sequelize.authenticate();
  app.listen(PORT, () => {
    logger.info(`Running on port ${PORT}`);
  });
};

start();
