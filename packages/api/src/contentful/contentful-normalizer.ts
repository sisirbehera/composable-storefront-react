import { CmsPage, CmsSlot, CmsComponent } from '@storefront/core';
import {
  ContentfulCollection,
  ContentfulEntry,
  ContentfulAsset,
} from '../mocks/fixtures/contentful-pages.fixture';

export class ContentfulNormalizer {
  /**
   * Normalizes a raw Contentful CDA Collection into a Spartacus-compatible CmsPage.
   */
  static normalizePage(
    collection: ContentfulCollection,
    requestedPageId: string
  ): CmsPage | null {
    if (!collection || !collection.items || collection.items.length === 0) {
      return null;
    }

    // Build lookup maps for included entries and assets
    const entryMap = new Map<string, ContentfulEntry>();
    const assetMap = new Map<string, ContentfulAsset>();

    if (collection.includes?.Entry) {
      collection.includes.Entry.forEach((entry) => {
        entryMap.set(entry.sys.id, entry);
      });
    }

    if (collection.includes?.Asset) {
      collection.includes.Asset.forEach((asset) => {
        assetMap.set(asset.sys.id, asset);
      });
    }

    // Find the primary page entry matching the slug or use the first item
    const pageEntry =
      collection.items.find(
        (item) => item.fields.slug === requestedPageId || item.fields.slug === `/${requestedPageId}`
      ) || collection.items[0];

    if (!pageEntry) {
      return null;
    }

    const { title, template, seoDescription, slots = [] } = pageEntry.fields;

    const normalizedSlots: Record<string, CmsSlot> = {};

    // Process referenced slots
    slots.forEach((slotRef: any) => {
      const slotId = slotRef?.sys?.id;
      const slotEntry = slotId ? entryMap.get(slotId) : null;

      if (!slotEntry) return;

      const slotPosition = slotEntry.fields.position || slotEntry.fields.slotId || 'DefaultSlot';
      const slotName = slotEntry.fields.name || slotPosition;
      const componentRefs = slotEntry.fields.components || [];

      const normalizedComponents: CmsComponent[] = [];

      componentRefs.forEach((compRef: any) => {
        const compId = compRef?.sys?.id;
        const compEntry = compId ? entryMap.get(compId) : null;
        if (!compEntry) return;

        const normalizedComponent = this.normalizeComponent(compEntry, assetMap);
        if (normalizedComponent) {
          normalizedComponents.push(normalizedComponent);
        }
      });

      normalizedSlots[slotPosition] = {
        slotId: slotPosition,
        position: slotPosition,
        name: slotName,
        components: normalizedComponents,
      };
    });

    return {
      pageId: requestedPageId,
      template: template || 'LandingPage2Template',
      title: title || 'Contentful Page',
      description: seoDescription || '',
      slots: normalizedSlots,
    };
  }

  /**
   * Translates a Contentful Content Type into a Spartacus CmsComponent model.
   */
  private static normalizeComponent(
    entry: ContentfulEntry,
    assetMap: Map<string, ContentfulAsset>
  ): CmsComponent | null {
    const contentType = entry.sys.contentType?.sys?.id || 'unknown';
    const fields = entry.fields;
    const uid = entry.sys.id;

    switch (contentType) {
      case 'heroBanner':
      case 'promoBanner': {
        const assetId = fields.mediaAsset?.sys?.id;
        const asset = assetId ? assetMap.get(assetId) : null;
        const rawUrl = asset?.fields?.file?.url || '';
        const mediaUrl = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;

        return {
          uid,
          typeCode: 'SimpleResponsiveBannerComponent',
          name: fields.internalName || 'Contentful Hero Banner',
          properties: {
            headline: fields.headline,
            content: fields.content,
            urlLink: fields.ctaUrl || '/search',
            media: {
              url: mediaUrl || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1400&q=85',
              altText: asset?.fields?.title || fields.headline || 'Banner Image',
            },
          },
        };
      }

      case 'productCarousel': {
        return {
          uid,
          typeCode: 'ProductCarouselComponent',
          name: fields.internalName || 'Contentful Product Carousel',
          properties: {
            title: fields.title || 'Featured Products',
            productCodes: fields.productCodes || ['CONF-DEMO-001', 'CONF-DEMO-002'],
          },
        };
      }

      case 'richTextSection':
      case 'paragraph': {
        return {
          uid,
          typeCode: 'CMSParagraphComponent',
          name: fields.internalName || 'Contentful Rich Text',
          properties: {
            content: typeof fields.content === 'string' ? fields.content : JSON.stringify(fields.content),
          },
        };
      }

      default: {
        // Fallback for custom or unrecognized Contentful content types
        return {
          uid,
          typeCode: contentType,
          name: fields.internalName || fields.title || contentType,
          properties: fields,
        };
      }
    }
  }
}
