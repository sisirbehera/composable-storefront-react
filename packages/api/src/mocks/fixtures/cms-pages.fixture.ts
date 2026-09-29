import { CmsPage } from '@storefront/core';

export const mockCmsPages: Record<string, CmsPage> = {
  homepage: {
    pageId: 'homepage',
    template: 'LandingPage2Template',
    title: 'Composable Storefront | Powered by Next.js & React',
    description: 'High-performance headless e-commerce storefront equivalent to SAP Spartacus.',
    slots: {
      Section1: {
        slotId: 'Section1Slot-Homepage',
        position: 'Section1',
        name: 'Hero Banner Slot',
        components: [
          {
            uid: 'ElectronicsHeroBanner',
            typeCode: 'SimpleResponsiveBannerComponent',
            name: 'Homepage Hero Banner',
            properties: {
              headline: 'Next-Gen Composable Commerce',
              content: 'Experience ultra-fast headless storefront performance built on Next.js 15, dynamic CMS slots, and pluggable SAP Commerce OCC adapters.',
              media: {
                url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80',
                altText: 'Next Gen Tech Hardware',
              },
              urlLink: '/products/CONF-DEMO-001',
              external: false,
            },
          },
        ],
      },
      Section2A: {
        slotId: 'Section2ASlot-Homepage',
        position: 'Section2A',
        name: 'Intro Paragraph Slot',
        components: [
          {
            uid: 'StorefrontIntroParagraph',
            typeCode: 'CMSParagraphComponent',
            name: 'Composable Storefront Value Prop',
            properties: {
              content: `
                <div class="cms-intro-box">
                  <h3>Decoupled. Modular. High-Performance.</h3>
                  <p>
                    This architecture translates SAP Spartacus principles into modern React and Next.js:
                    <strong>dynamic slot-to-component mapping</strong>, <strong>configurable live vs. mock OCC connectors</strong>,
                    and <strong>zero UI lock-in</strong> through decoupled domain normalizers.
                  </p>
                </div>
              `,
            },
          },
        ],
      },
      Section3: {
        slotId: 'Section3Slot-Homepage',
        position: 'Section3',
        name: 'Featured Products Slot',
        components: [
          {
            uid: 'FeaturedProductsCarousel',
            typeCode: 'ProductCarouselComponent',
            name: 'Featured Tech Innovations',
            properties: {
              title: 'Featured Products',
              productCodes: [
                'CONF-DEMO-001',
                'CONF-DEMO-002',
                'CONF-DEMO-003',
                'CONF-DEMO-004',
              ],
            },
          },
        ],
      },
      Section4: {
        slotId: 'Section4Slot-Homepage',
        position: 'Section4',
        name: 'Secondary Promo Slot',
        components: [
          {
            uid: 'PromoBannerComponent',
            typeCode: 'SimpleResponsiveBannerComponent',
            name: 'Spring Tech Promotion Banner',
            properties: {
              headline: 'Upgrade Your Workspace',
              content: 'Premium monitors, studio headphones, and ergonomic peripherals crafted for modern creators.',
              media: {
                url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80',
                altText: 'Modern Workspace Tech',
              },
              urlLink: '/products/CONF-DEMO-002',
              external: false,
            },
          },
        ],
      },
      Section5: {
        slotId: 'Section5Slot-Homepage',
        position: 'Section5',
        name: 'Interactive Tabbed Content Slot',
        components: [
          {
            uid: 'StorefrontTabsComponent',
            typeCode: 'TabContainerComponent',
            name: 'Storefront Capabilities Tabs',
            properties: {
              title: 'Enterprise Composable Capabilities',
              tabs: [
                {
                  id: 'tab-cms',
                  title: 'Dynamic CMS & SmartEdit',
                  content: 'Full SAP SmartEdit support with bi-directional postMessage communication, in-context authoring overlays, live property editing, and dynamic slot rearrangement.\n\nAllows marketing and content teams to manage pages visually in real-time without developer intervention.',
                },
                {
                  id: 'tab-occ',
                  title: 'Pluggable OCC Adapters',
                  content: 'Switch between SAP Commerce Cloud (Hybris OCC REST API), Contentful Headless CMS, or simulated local Mock data fixtures with a single config flag.\n\nAll UI components interact with clean domain models, fully insulated from backend schema changes.',
                },
                {
                  id: 'tab-perf',
                  title: 'Next.js 15 & Turborepo',
                  content: 'Engineered with React Server Components, incremental static regeneration, Turborepo parallel caching pipelines, and modern Tailwind CSS design tokens for sub-second page loads worldwide.',
                },
              ],
            },
          },
        ],
      },
      Section6: {
        slotId: 'Section6Slot-Homepage',
        position: 'Section6',
        name: 'Product Showcase Video Slot',
        components: [
          {
            uid: 'ProductShowcaseVideo',
            typeCode: 'CMSVideoComponent',
            name: 'Acoustic Engineering Video',
            properties: {
              title: 'Precision Acoustic Engineering',
              caption: 'Go behind the scenes with our audio engineers to see how high-resolution audio transducers and dual-processor noise canceling were created.',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
          },
        ],
      },
    },
  },
  faq: {
    pageId: 'faqPage',
    template: 'ContentPage1Template',
    title: 'Frequently Asked Questions',
    description: 'Learn about our headless composable architecture.',
    slots: {
      Section1: {
        slotId: 'FaqContentSlot',
        position: 'Section1',
        components: [
          {
            uid: 'FaqParagraph',
            typeCode: 'CMSParagraphComponent',
            properties: {
              content: `
                <h2>How does this compare to SAP Spartacus?</h2>
                <p>
                  Spartacus is built on Angular and NgRx. This storefront translates those exact capabilities into Next.js App Router,
                  React Server Components, and modular NPM packages while preserving Hybris OCC compatibility and SmartEdit contracts.
                </p>
                <h2>How do I switch from Mock Data to Live SAP Commerce?</h2>
                <p>
                  Set <code>COMMERCE_USE_MOCK_DATA=false</code> in your environment or update <code>storefront.config.ts</code> with your Hybris OCC endpoint.
                </p>
              `,
            },
          },
        ],
      },
    },
  },
  'homepage-apparel-uk': {
    pageId: 'homepage-apparel-uk',
    template: 'LandingPage2Template',
    title: 'Apparel & Fashion UK | Autumn & Winter Collection 2026',
    description: 'Bespoke British tailoring, heritage trench coats, and luxury footwear.',
    slots: {
      Section1: {
        slotId: 'Section1Slot-Apparel',
        position: 'Section1',
        name: 'Hero Banner Slot',
        components: [
          {
            uid: 'ApparelHeroBanner',
            typeCode: 'SimpleResponsiveBannerComponent',
            name: 'Apparel Hero Banner',
            properties: {
              headline: 'Autumn & Winter Collection 2026',
              content: 'Discover heritage British craftsmanship, weatherproof cotton gabardine trench coats, and Goodyear-welted leather footwear.',
              media: {
                url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
                altText: 'Autumn Fashion Collection',
              },
              urlLink: '/products/APP-001',
              external: false,
            },
          },
        ],
      },
      Section2A: {
        slotId: 'Section2ASlot-Apparel',
        position: 'Section2A',
        name: 'Intro Paragraph Slot',
        components: [
          {
            uid: 'ApparelIntroParagraph',
            typeCode: 'CMSParagraphComponent',
            name: 'Apparel Value Prop',
            properties: {
              content: `
                <div class="cms-intro-box">
                  <h3>Tailored in Great Britain</h3>
                  <p>
                    From Yorkshire gabardine mills to Northampton bootmakers, our Apparel Storefront represents centuries of textile artistry paired with ultra-fast composable commerce.
                  </p>
                </div>
              `,
            },
          },
        ],
      },
      Section3: {
        slotId: 'Section3Slot-Apparel',
        position: 'Section3',
        name: 'Featured Products Slot',
        components: [
          {
            uid: 'ApparelProductCarousel',
            typeCode: 'ProductCarouselComponent',
            name: 'Featured Apparel Items',
            properties: {
              title: 'Curated Autumn Essentials',
              productCodes: ['APP-001', 'APP-002', 'APP-003', 'APP-004'],
            },
          },
        ],
      },
    },
  },
  'homepage-powertools-spa': {
    pageId: 'homepage-powertools-spa',
    template: 'LandingPage2Template',
    title: 'Industrial Powertools B2B | Professional Equipment & Machinery',
    description: 'Heavy-duty cordless hammer drills, brushless saws, and industrial toolkits.',
    slots: {
      Section1: {
        slotId: 'Section1Slot-Powertools',
        position: 'Section1',
        name: 'Hero Banner Slot',
        components: [
          {
            uid: 'PowertoolsHeroBanner',
            typeCode: 'SimpleResponsiveBannerComponent',
            name: 'Powertools Hero Banner',
            properties: {
              headline: 'Heavy-Duty Industrial Powertools',
              content: 'Equip your construction job sites with brushless 18V Li-Ion technology, rotary hammer drills, and contractor-grade toolkits.',
              media: {
                url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1600&q=80',
                altText: 'Industrial Powertools',
              },
              urlLink: '/products/TOOL-001',
              external: false,
            },
          },
        ],
      },
      Section2A: {
        slotId: 'Section2ASlot-Powertools',
        position: 'Section2A',
        name: 'Intro Paragraph Slot',
        components: [
          {
            uid: 'PowertoolsIntroParagraph',
            typeCode: 'CMSParagraphComponent',
            name: 'Powertools Value Prop',
            properties: {
              content: `
                <div class="cms-intro-box">
                  <h3>Engineered for Extreme Job Sites</h3>
                  <p>
                    B2B high-volume ordering, tiered volume pricing, contractor account invoicing, and next-day job site dispatch.
                  </p>
                </div>
              `,
            },
          },
        ],
      },
      Section3: {
        slotId: 'Section3Slot-Powertools',
        position: 'Section3',
        name: 'Featured Products Slot',
        components: [
          {
            uid: 'PowertoolsProductCarousel',
            typeCode: 'ProductCarouselComponent',
            name: 'Featured Contractor Tools',
            properties: {
              title: 'High-Performance Contractor Picks',
              productCodes: ['TOOL-001', 'TOOL-002', 'TOOL-003', 'TOOL-004'],
            },
          },
        ],
      },
    },
  },
};
