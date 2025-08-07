import z from 'zod';
import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${NODE_ENV}` });

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().min(1),
  CORS_ORIGIN: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'error']).default('info'),
  SWAGGER_ENABLED: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

const env = EnvSchema.parse(process.env);

export interface Config {
  env: string;
  port: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  swagger: {
    enabled: boolean;
  };
  logging: {
    level: string;
  };
}

const development: Config = {
  env: 'development',
  port: env.PORT,
  database: {
    url: env.DATABASE_URL
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100,                   // limit each IP to 100 requests per windowMs
  },
  swagger: {
    enabled: true,
  },
  logging: {
    level: 'debug',
  },
};

const test: Config = {
  env: 'test',
  port: env.PORT,
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 1000,                   // Higher limit for testing
  },
  swagger: {
    enabled: false,              // Disable swagger in test environment
  },
  logging: {
    level: 'error',              // Only log errors in test
  },
};

const production: Config = {
  env: 'production',
  port: env.PORT,
  database: {
    url: env.DATABASE_URL
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,      // 15 minutes
    max: 50,                       // Stricter limit for production
  },
  swagger: {
    enabled: env.SWAGGER_ENABLED, // Disabled by default in production
  },
  logging: {
    level: 'info',
  },
};

const configs: Record<string, Config> = {
  development,
  test,
  production,
};

export const config: Config = configs[NODE_ENV] || development;

export default config; 