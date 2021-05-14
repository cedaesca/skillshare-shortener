import { config } from 'dotenv';

config();

export const environment = {
  fallbackPort: parseInt(process.env.FALLBACK_PORT),
  baseUrl: process.env.BASE_URL,
};
