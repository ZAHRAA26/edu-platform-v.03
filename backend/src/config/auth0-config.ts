import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { ManagementClient } from 'auth0';
import { config } from './environment';

// Auth0 configuration (using centralized config)
export const auth0Config = config.auth0;

// JWT middleware for protecting routes
export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Config.domain}/.well-known/jwks.json`
  }),
  audience: auth0Config.audience,
  issuer: auth0Config.issuer,
  algorithms: ['RS256']
});

// Auth0 Management API client
export const managementClient = new ManagementClient({
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
  clientSecret: auth0Config.clientSecret
});

// Helper function to get user from Auth0
export const getAuth0User = async (userId: string) => {
  try {
    const user = await managementClient.users.get({ id: userId });
    return user.data;
  } catch (error) {
    console.error('Error fetching Auth0 user:', error);
    throw error;
  }
};

// Helper function to update user metadata in Auth0
export const updateAuth0UserMetadata = async (userId: string, metadata: any) => {
  try {
    const result = await managementClient.users.update(
      { id: userId },
      { user_metadata: metadata }
    );
    return result.data;
  } catch (error) {
    console.error('Error updating Auth0 user metadata:', error);
    throw error;
  }
};

// Helper function to get user roles from token
export const getUserRoles = (req: any): string[] => {
  const token = req.auth;
  if (!token) return [];
  
  // Extract roles from token claims
  // Try multiple possible claim locations
  const roles = token['https://edu-platform.com/roles'] || 
                token['roles'] || 
                token['https://your-domain.auth0.com/roles'] ||
                token.permissions || 
                [];
  return Array.isArray(roles) ? roles : [roles];
};

// Helper function to check if user has specific role
export const hasRole = (req: any, role: string): boolean => {
  const roles = getUserRoles(req);
  return roles.includes(role);
};