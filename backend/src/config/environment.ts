import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_AUDIENCE',
  'MONGODB_URI'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Environment configuration object
export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Database Configuration
  database: {
    mongoUri: process.env.MONGODB_URI!,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Auth0 Configuration
  auth0: {
    domain: process.env.AUTH0_DOMAIN!,
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    audience: process.env.AUTH0_AUDIENCE!,
    issuer: process.env.AUTH0_ISSUER || `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'] as const,
  },

  // MinIO Configuration
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    useSSL: process.env.MINIO_USE_SSL === 'true',
    bucketName: process.env.MINIO_BUCKET_NAME || 'edu-platform',
  },

  // Security Configuration
  security: {
    deviceLimit: parseInt(process.env.DEVICE_LIMIT || '2', 10),
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // Admin Configuration
  admin: {
    defaultEmail: process.env.ADMIN_EMAIL || 'admin@edu-platform.com',
    defaultUsername: process.env.ADMIN_USERNAME || 'admin',
    defaultName: process.env.ADMIN_NAME || 'System Administrator',
  },

  // Application Configuration
  app: {
    name: process.env.APP_NAME || 'Educational Platform',
    version: process.env.APP_VERSION || '3.0.0',
    description: process.env.APP_DESCRIPTION || 'Smart Educational Platform',
  },

  // Feature Flags
  features: {
    enableMetrics: process.env.ENABLE_METRICS !== 'false',
    enableSentry: process.env.ENABLE_SENTRY === 'true',
    enableDeviceTracking: process.env.ENABLE_DEVICE_TRACKING !== 'false',
    enableFileUpload: process.env.ENABLE_FILE_UPLOAD !== 'false',
  },
};

// Helper functions
export const isDevelopment = () => config.server.nodeEnv === 'development';
export const isProduction = () => config.server.nodeEnv === 'production';
export const isTest = () => config.server.nodeEnv === 'test';

// Validation helper
export const validateConfig = () => {
  const errors: string[] = [];

  // Validate Auth0 domain format
  if (!config.auth0.domain.includes('.auth0.com') && !config.auth0.domain.includes('.')) {
    errors.push('AUTH0_DOMAIN must be a valid domain (e.g., your-domain.auth0.com)');
  }

  // Validate MongoDB URI format
  if (!config.database.mongoUri.startsWith('mongodb://') && !config.database.mongoUri.startsWith('mongodb+srv://')) {
    errors.push('MONGODB_URI must be a valid MongoDB connection string');
  }

  // Validate port range
  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration validation errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  console.log('✅ Configuration validation passed');
};

// Export default config
export default config;