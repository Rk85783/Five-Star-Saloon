import 'dotenv/config';

const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number.parseInt(process.env.API_PORT || '3000', 10),
  allowedOrigins,
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error('API_PORT must be an integer from 1 to 65535.');
}
