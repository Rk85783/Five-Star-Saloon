import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import healthRouter from './routes/health.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  methods: ['GET'],
}));

app.use('/api/health', healthRouter);

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' });
});

export default app;
