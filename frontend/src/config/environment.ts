// Environment configuration for Frontend
const requiredEnvVars = [
  'VITE_AUTH0_DOMAIN',
  'VITE_AUTH0_CLIENT_ID',
  'VITE_BACKEND_URL'
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file and ensure all required variables are set.');
}

// Environment configuration object
export const config = {
  // Auth0 Configuration
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.auth0.com',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://edu-platform-api.com',
    redirectUri: window.location.origin,
    scope: 'openid profile email',
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Educational Platform',
    version: import.meta.env.VITE_APP_VERSION || '3.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Smart Educational Platform',
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@edu-platform.com',
  },

  // Feature Flags
  features: {
    enableDeviceTracking: import.meta.env.VITE_ENABLE_DEVICE_TRACKING !== 'false',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false',
  },

  // UI Configuration
  ui: {
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'ar',
    theme: import.meta.env.VITE_DEFAULT_THEME || 'light',
    itemsPerPage: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '10', 10),
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760', 10), // 10MB
  },

  // Development Configuration
  development: {
    enableDebug: import.meta.env.DEV,
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  },
};

// Helper functions
export const isDevelopment = () => import.meta.env.DEV;
export const isProduction = () => import.meta.env.PROD;

// Validation helper
export const validateConfig = () => {
  const errors: string[] = [];

  // Validate Auth0 domain format
  if (!config.auth0.domain.includes('.auth0.com') && !config.auth0.domain.includes('.')) {
    errors.push('VITE_AUTH0_DOMAIN must be a valid domain (e.g., your-domain.auth0.com)');
  }

  // Validate API URL format
  if (!config.api.baseUrl.startsWith('http://') && !config.api.baseUrl.startsWith('https://')) {
    errors.push('VITE_BACKEND_URL must be a valid URL (e.g., http://localhost:5000/api)');
  }

  if (errors.length > 0) {
    console.error('❌ Frontend configuration validation errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    
    if (isProduction()) {
      throw new Error('Configuration validation failed in production');
    }
  } else {
    console.log('✅ Frontend configuration validation passed');
  }
};

// Log configuration in development
if (isDevelopment() && config.development.enableDebug) {
  console.log('🔧 Frontend Configuration:', {
    auth0: {
      domain: config.auth0.domain,
      clientId: config.auth0.clientId.substring(0, 8) + '...',
    },
    api: config.api,
    features: config.features,
  });
}

// Export default config
export default config;