// import 'dotenv/config';
// import { get } from 'env-var';

// export const envs = {
//  PORT: get('PORT').default(8080).asPortNumber(),
//  API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
//  NODE_ENV: get('NODE_ENV').default('development').asString()
// };


import dotenv from 'dotenv';

dotenv.config();

export const envs = {
  PORT: parseInt(process.env.PORT || '8080', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET,
};
