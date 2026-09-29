import { AuthToken, OccConfig } from '@storefront/core';

const STORAGE_KEY_TOKEN = 'storefront_auth_token';

export class TokenManager {
  private occConfig?: OccConfig;
  private currentToken: AuthToken | null = null;

  constructor(occConfig?: OccConfig) {
    this.occConfig = occConfig;
  }

  isTokenExpired(token: AuthToken): boolean {
    if (!token.expires_at) return false;
    // Buffer by 30 seconds
    return Date.now() >= token.expires_at - 30000;
  }

  async getClientToken(): Promise<AuthToken> {
    if (this.currentToken && !this.isTokenExpired(this.currentToken)) {
      return this.currentToken;
    }

    if (this.occConfig?.baseUrl) {
      try {
        return await this.fetchOccClientToken();
      } catch (e) {
        console.warn('[TokenManager] OCC client token fetch failed, falling back to mock:', e);
      }
    }

    // Mock guest token
    const mockToken: AuthToken = {
      access_token: `mock_guest_token_${Date.now()}`,
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Date.now() + 3600 * 1000,
      scope: 'basic',
    };

    this.currentToken = mockToken;
    return mockToken;
  }

  async fetchOccClientToken(): Promise<AuthToken> {
    if (!this.occConfig?.baseUrl) {
      throw new Error('OCC baseUrl not configured');
    }

    const url = `${this.occConfig.baseUrl.replace(/\/$/, '')}/authorizationserver/oauth/token`;
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.occConfig.clientId || 'mobile_android',
      client_secret: this.occConfig.clientSecret || 'secret',
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      throw new Error(`Failed to obtain client token: ${res.statusText}`);
    }

    const data = await res.json();
    const token: AuthToken = {
      ...data,
      expires_at: Date.now() + data.expires_in * 1000,
    };
    this.currentToken = token;
    return token;
  }

  async fetchUserToken(username: string, password?: string): Promise<AuthToken> {
    if (this.occConfig?.baseUrl && password) {
      try {
        const url = `${this.occConfig.baseUrl.replace(/\/$/, '')}/authorizationserver/oauth/token`;
        const params = new URLSearchParams({
          grant_type: 'password',
          username,
          password,
          client_id: this.occConfig.clientId || 'mobile_android',
          client_secret: this.occConfig.clientSecret || 'secret',
        });

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        if (res.ok) {
          const data = await res.json();
          const token: AuthToken = {
            ...data,
            expires_at: Date.now() + data.expires_in * 1000,
          };
          this.saveStoredToken(token);
          return token;
        }
      } catch (e) {
        console.warn('[TokenManager] OCC user token fetch failed, falling back to mock:', e);
      }
    }

    // Mock token
    const token: AuthToken = {
      access_token: `mock_customer_jwt_${Date.now()}`,
      refresh_token: `mock_refresh_jwt_${Date.now()}`,
      token_type: 'bearer',
      expires_in: 7200,
      expires_at: Date.now() + 7200 * 1000,
      scope: 'basic openid',
    };

    this.saveStoredToken(token);
    return token;
  }

  async refreshUserToken(refreshToken: string): Promise<AuthToken> {
    if (this.occConfig?.baseUrl) {
      try {
        const url = `${this.occConfig.baseUrl.replace(/\/$/, '')}/authorizationserver/oauth/token`;
        const params = new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.occConfig.clientId || 'mobile_android',
          client_secret: this.occConfig.clientSecret || 'secret',
        });

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        if (res.ok) {
          const data = await res.json();
          const token: AuthToken = {
            ...data,
            expires_at: Date.now() + data.expires_in * 1000,
          };
          this.saveStoredToken(token);
          return token;
        }
      } catch (e) {
        console.warn('[TokenManager] Failed to refresh token:', e);
      }
    }

    // Fallback renewed token
    const token: AuthToken = {
      access_token: `mock_customer_jwt_refreshed_${Date.now()}`,
      refresh_token: refreshToken,
      token_type: 'bearer',
      expires_in: 7200,
      expires_at: Date.now() + 7200 * 1000,
      scope: 'basic openid',
    };
    this.saveStoredToken(token);
    return token;
  }

  saveStoredToken(token: AuthToken): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(token));
      } catch (e) {
        // ignore localStorage errors
      }
    }
  }

  getStoredToken(): AuthToken | null {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_TOKEN);
        if (raw) {
          return JSON.parse(raw) as AuthToken;
        }
      } catch (e) {
        // ignore JSON parse errors
      }
    }
    return null;
  }

  clearStoredToken(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      } catch (e) {
        // ignore
      }
    }
  }
}
