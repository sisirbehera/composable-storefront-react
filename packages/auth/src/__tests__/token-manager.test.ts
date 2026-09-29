import { describe, it, expect, beforeEach } from 'vitest';
import { TokenManager } from '../tokens/token-manager';
import { AuthToken } from '@storefront/core';

describe('TokenManager (OAuth2 Security & Lifecycle)', () => {
  let tokenManager: TokenManager;

  beforeEach(() => {
    tokenManager = new TokenManager();
  });

  it('generates a valid client (guest) token when unauthenticated', async () => {
    const token = await tokenManager.getClientToken();
    expect(token).toBeDefined();
    expect(token.access_token).toContain('mock_guest_token_');
    expect(token.token_type.toLowerCase()).toBe('bearer');
    expect(token.expires_in).toBe(3600);
    expect(token.expires_at).toBeGreaterThan(Date.now());
  });

  it('reuses active client token if not expired', async () => {
    const token1 = await tokenManager.getClientToken();
    const token2 = await tokenManager.getClientToken();
    expect(token1.access_token).toBe(token2.access_token);
  });

  it('detects expired tokens with 30-second buffer', () => {
    const validToken: AuthToken = {
      access_token: 'valid',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Date.now() + 60000, // 60s in future
    };
    expect(tokenManager.isTokenExpired(validToken)).toBe(false);

    const expiringSoonToken: AuthToken = {
      access_token: 'expiring_soon',
      token_type: 'bearer',
      expires_in: 30,
      expires_at: Date.now() + 20000, // 20s in future (< 30s buffer)
    };
    expect(tokenManager.isTokenExpired(expiringSoonToken)).toBe(true);

    const alreadyExpiredToken: AuthToken = {
      access_token: 'expired',
      token_type: 'bearer',
      expires_in: 0,
      expires_at: Date.now() - 5000,
    };
    expect(tokenManager.isTokenExpired(alreadyExpiredToken)).toBe(true);
  });

  it('authenticates user and generates user tokens with refresh token', async () => {
    const token = await tokenManager.fetchUserToken('alex.morgan@example.com', 'password123');
    expect(token.access_token).toContain('mock_customer_jwt_');
    expect(token.refresh_token).toBeDefined();
    expect(token.expires_in).toBe(7200);
  });

  it('rotates user access token via refresh token', async () => {
    const originalToken = await tokenManager.fetchUserToken('test@user.com', 'secret');
    const refreshedToken = await tokenManager.refreshUserToken(originalToken.refresh_token!);
    expect(refreshedToken.access_token).toContain('mock_customer_jwt_refreshed_');
    expect(refreshedToken.refresh_token).toBe(originalToken.refresh_token);
  });
});
