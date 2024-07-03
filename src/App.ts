import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { router } from './Routes';
import LoggerMiddleware from './Middlewares/LoggerMiddleware';

declare global {
  var _requestId: number;
}

const app = express();

// middlewares
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(LoggerMiddleware);
app.use(express.static('public'));
// routes
app.use('/', router);

// 404 page
app.get('*', (req, res) => {
  res.status(404).send('Requested page could not be found.');
});

export default app;
