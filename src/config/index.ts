import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

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
  port: parseInt(process.env.PORT || '8080', 10),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://feedback-board-admin:feedback-board-superunsafepassword@localhost:5432/feedback-board-dev',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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
  port: parseInt(process.env.PORT || '8081', 10),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://feedback-board-admin:feedback-board-superunsafepassword@localhost:5432/feedback-board-test',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'test-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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
  port: parseInt(process.env.PORT || '8080', 10),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://feedback-board-admin:feedback-board-superunsafepassword@localhost:5432/feedback-board',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'production-secret-key-must-be-set',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,      // 15 minutes
    max: 50,                       // Stricter limit for production
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true', // Disabled by default in production
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

export const config: Config = configs[env] || development;

export default config; 