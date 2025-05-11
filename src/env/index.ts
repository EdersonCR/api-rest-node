import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test'});
} else {
  config();
}

const envSchemma = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchemma.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalide enviroment variables', _env.error.format());
  throw new Error('Invalide enviroment variables');
}

export const env = _env.data;
