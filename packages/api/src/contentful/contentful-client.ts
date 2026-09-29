import { ContentfulConfig } from '@storefront/core';
import {
  ContentfulCollection,
  mockContentfulPages,
} from '../mocks/fixtures/contentful-pages.fixture';

export class ContentfulClient {
  private spaceId?: string;
  private accessToken?: string;
  private environment: string;
  private useMockData: boolean;

  constructor(config?: ContentfulConfig, useMockData = true) {
    this.spaceId = config?.spaceId;
    this.accessToken = config?.accessToken;
    this.environment = config?.environment || 'master';
    this.useMockData = useMockData;
  }

  /**
   * Fetches entries from Contentful Delivery API (CDA) or returns mock fixtures.
   */
  async getPageEntries(slug: string): Promise<ContentfulCollection | null> {
    const normalizedSlug = slug.replace(/^\//, '') || 'homepage';

    // 1. If mock mode is enforced or credentials are not supplied, return fixture
    if (this.useMockData || !this.spaceId || !this.accessToken) {
      const fixture = mockContentfulPages[normalizedSlug] || mockContentfulPages['homepage'];
      return fixture ? JSON.parse(JSON.stringify(fixture)) : null;
    }

    // 2. Fetch live from Contentful CDA
    try {
      const endpoint = `https://cdn.contentful.com/spaces/${this.spaceId}/environments/${this.environment}/entries?content_type=landingPage&fields.slug=${encodeURIComponent(normalizedSlug)}&include=3`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      } as any);

      if (!response.ok) {
        console.warn(
          `[ContentfulClient] Live CDA responded with status ${response.status}. Falling back to mock fixture.`
        );
        return mockContentfulPages[normalizedSlug] || null;
      }

      const data: ContentfulCollection = await response.json();
      return data;
    } catch (err) {
      console.warn(
        '[ContentfulClient] Live CDA fetch failed, falling back to mock fixture:',
        err
      );
      return mockContentfulPages[normalizedSlug] || null;
    }
  }
}
