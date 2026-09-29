/**
 * Realistic Contentful Content Delivery API (CDA) JSON fixtures.
 * Mirrors the exact JSON payload returned by Contentful CDA /spaces/{space_id}/entries.
 */

export interface ContentfulSys {
  id: string;
  type: string;
  contentType?: {
    sys: {
      id: string;
      linkType: string;
      type: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
  locale?: string;
}

export interface ContentfulAsset {
  sys: ContentfulSys;
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details?: {
        size?: number;
        image?: { width: number; height: number };
      };
      fileName?: string;
      contentType?: string;
    };
  };
}

export interface ContentfulEntry<T = Record<string, any>> {
  sys: ContentfulSys;
  fields: T;
}

export interface ContentfulCollection<T = any> {
  sys: { type: 'Array' };
  total: number;
  skip: number;
  limit: number;
  items: ContentfulEntry<T>[];
  includes?: {
    Asset?: ContentfulAsset[];
    Entry?: ContentfulEntry[];
  };
}

export const mockContentfulPages: Record<string, ContentfulCollection> = {
  homepage: {
    sys: { type: 'Array' },
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      {
        sys: {
          id: 'contentful-page-home',
          type: 'Entry',
          contentType: {
            sys: { id: 'landingPage', linkType: 'ContentType', type: 'Link' },
          },
        },
        fields: {
          title: 'Contentful Headless Composable Hub',
          slug: 'homepage',
          template: 'LandingPage2Template',
          seoDescription: 'Enterprise storefront powered by Contentful CMS Delivery API and Next.js',
          slots: [
            {
              sys: { id: 'slot-section1', type: 'Link', linkType: 'Entry' },
            },
            {
              sys: { id: 'slot-section2', type: 'Link', linkType: 'Entry' },
            },
            {
              sys: { id: 'slot-section3', type: 'Link', linkType: 'Entry' },
            },
          ],
        },
      },
    ],
    includes: {
      Entry: [
        // Section 1 Slot: Hero Banner
        {
          sys: {
            id: 'slot-section1',
            type: 'Entry',
            contentType: {
              sys: { id: 'cmsSlot', linkType: 'ContentType', type: 'Link' },
            },
          },
          fields: {
            slotId: 'Section1',
            position: 'Section1',
            name: 'Hero Top Slot (Contentful)',
            components: [
              {
                sys: { id: 'comp-banner-spring', type: 'Link', linkType: 'Entry' },
              },
            ],
          },
        },
        {
          sys: {
            id: 'comp-banner-spring',
            type: 'Entry',
            contentType: {
              sys: { id: 'heroBanner', linkType: 'ContentType', type: 'Link' },
            },
          },
          fields: {
            internalName: 'Spring Innovation Hero Banner',
            headline: 'Spring 2026 Innovation Wave (Contentful CMS)',
            content: 'Decoupled content orchestration streaming directly from Contentful Headless Space. Real-time previews, multi-region CDN delivery, and rich composable components.',
            ctaText: 'Explore Collection',
            ctaUrl: '/search',
            mediaAsset: {
              sys: { id: 'asset-spring-hero', type: 'Link', linkType: 'Asset' },
            },
          },
        },

        // Section 2 Slot: Featured Audio Carousel
        {
          sys: {
            id: 'slot-section2',
            type: 'Entry',
            contentType: {
              sys: { id: 'cmsSlot', linkType: 'ContentType', type: 'Link' },
            },
          },
          fields: {
            slotId: 'Section2',
            position: 'Section2',
            name: 'Featured Products Slot (Contentful)',
            components: [
              {
                sys: { id: 'comp-carousel-featured', type: 'Link', linkType: 'Entry' },
              },
            ],
          },
        },
        {
          sys: {
            id: 'comp-carousel-featured',
            type: 'Entry',
            contentType: {
              sys: { id: 'productCarousel', linkType: 'ContentType', type: 'Link' },
            },
          },
          fields: {
            internalName: 'Editorial Featured Gear Carousel',
            title: 'Contentful Editorial Picks',
            productCodes: ['CONF-DEMO-001', 'CONF-DEMO-002', 'CONF-DEMO-003', 'CONF-DEMO-004'],
          },
        },

        // Section 3 Slot: Informational Paragraph
        {
          sys: {
            id: 'slot-section3',
            type: 'Entry',
            contentType: {
              sys: { id: 'cmsSlot', linkType: 'ContentType', type: 'Link' },
            },
          },
          fields: {
            slotId: 'Section3',
            position: 'Section3',
            name: 'Footer CMS Story Slot (Contentful)',
            components: [
              {
                sys: { id: 'comp-info-paragraph', type: 'Link', linkType: 'Entry' },
              },
            ],
          },
        },
        {
          sys: {
            id: 'comp-info-paragraph',
            type: 'Entry',
            contentType: {
              sys: { id: 'richTextSection', linkType: 'ContentType', type: 'Link' },
            },
          },
          fields: {
            internalName: 'Contentful Composable Architecture Overview',
            content: 'This storefront connects directly to Contentful Content Delivery API (CDA). Marketers build and version content within Contentful web app, while the Next.js frontend fetches entries via GraphQL or REST and normalizes them into Spartacus-compatible layout slots.',
          },
        },
      ],
      Asset: [
        {
          sys: {
            id: 'asset-spring-hero',
            type: 'Asset',
          },
          fields: {
            title: 'Modern Workspace Audio Setup',
            file: {
              url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1400&q=85',
              fileName: 'spring_hero.jpg',
              contentType: 'image/jpeg',
            },
          },
        },
      ],
    },
  },

  faq: {
    sys: { type: 'Array' },
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      {
        sys: {
          id: 'contentful-page-faq',
          type: 'Entry',
          contentType: {
            sys: { id: 'landingPage', linkType: 'ContentType', type: 'Link' },
          },
        },
        fields: {
          title: 'Frequently Asked Questions (Contentful CMS)',
          slug: 'faq',
          template: 'ContentPage1Template',
          seoDescription: 'Frequently asked questions managed via Contentful Headless CMS',
          slots: [
            {
              sys: { id: 'slot-faq-section1', type: 'Link', linkType: 'Entry' },
            },
          ],
        },
      },
    ],
    includes: {
      Entry: [
        {
          sys: {
            id: 'slot-faq-section1',
            type: 'Entry',
            contentType: {
              sys: { id: 'cmsSlot', linkType: 'ContentType', type: 'Link' },
            },
          },
          fields: {
            slotId: 'Section1',
            position: 'Section1',
            name: 'FAQ Main Slot',
            components: [
              {
                sys: { id: 'comp-faq-body', type: 'Link', linkType: 'Entry' },
              },
            ],
          },
        },
        {
          sys: {
            id: 'comp-faq-body',
            type: 'Entry',
            contentType: {
              sys: { id: 'richTextSection', linkType: 'ContentType', type: 'Link' },
            },
          },
          fields: {
            internalName: 'FAQ Content Section',
            content: '### How does the Contentful connector work?\n\nThe storefront uses a unified `CmsAdapter` contract. When `cms.provider` is set to `contentful`, the `ContentfulCmsAdapter` fetches structured JSON from Contentful CDA, normalizes models into standard `CmsPage` and `CmsSlot` structures, and streams them into the React CMS layout engine.\n\n### Can I switch between SAP OCC and Contentful at runtime?\n\nYes! The `AdapterFactory` decouples all pages from the underlying CMS vendor. You can switch between SAP Commerce Cloud (Hybris OCC), Mock fixtures, or Contentful in seconds without altering any frontend UI components.',
          },
        },
      ],
    },
  },
};
