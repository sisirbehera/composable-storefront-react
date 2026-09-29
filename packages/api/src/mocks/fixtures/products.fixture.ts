import { Product } from '@storefront/core';

export const mockProducts: Product[] = [
  {
    code: 'CONF-DEMO-001',
    name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    brand: 'Sony',
    summary: 'Industry-leading noise cancellation with two processors and eight microphones.',
    description: 'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. 2 processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.',
    price: {
      currencyIso: 'USD',
      value: 399.99,
      formattedValue: '$399.99',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        altText: 'Sony WH-1000XM5 Headphones Black',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
        altText: 'Sony WH-1000XM5 Thumbnail',
      },
    ],
    categories: [
      { code: 'audio', name: 'Audio & Sound' },
      { code: 'headphones', name: 'Headphones' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 42,
    },
    averageRating: 4.8,
    numberOfReviews: 128,
    classifications: [
      { code: 'batteryLife', name: 'Battery Life', value: '30 Hours' },
      { code: 'connectivity', name: 'Connectivity', value: 'Bluetooth 5.2' },
      { code: 'weight', name: 'Weight', value: '250 g' },
    ],
    url: '/products/CONF-DEMO-001',
  },
  {
    code: 'CONF-DEMO-002',
    name: 'Apple MacBook Pro 16" M3 Max',
    brand: 'Apple',
    summary: 'The ultimate pro laptop with astonishing performance and liquid retina XDR display.',
    description: 'MacBook Pro blasts forward with M3 Max, an incredibly advanced chip that brings massive performance and capabilities for extreme workflows.',
    price: {
      currencyIso: 'USD',
      value: 3499.0,
      formattedValue: '$3,499.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        altText: 'MacBook Pro 16 Inch Silver',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80',
        altText: 'MacBook Pro Thumbnail',
      },
    ],
    categories: [
      { code: 'computers', name: 'Computers & Tablets' },
      { code: 'laptops', name: 'Laptops' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 15,
    },
    averageRating: 4.9,
    numberOfReviews: 86,
    classifications: [
      { code: 'cpu', name: 'Processor', value: 'Apple M3 Max 16-core' },
      { code: 'ram', name: 'Memory', value: '36 GB Unified' },
      { code: 'storage', name: 'SSD Capacity', value: '1 TB' },
    ],
    url: '/products/CONF-DEMO-002',
  },
  {
    code: 'CONF-DEMO-003',
    name: 'Logitech MX Master 3S Wireless Mouse',
    brand: 'Logitech',
    summary: 'Quiet clicks and 8K DPI any-surface tracking performance mouse.',
    description: 'Meet MX Master 3S – an iconic mouse remastered. Feel every moment of your workflow with even more precision, tactility, and performance.',
    price: {
      currencyIso: 'USD',
      value: 99.99,
      formattedValue: '$99.99',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
        altText: 'Logitech MX Master 3S',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&q=80',
        altText: 'Logitech MX Master Thumbnail',
      },
    ],
    categories: [
      { code: 'accessories', name: 'Accessories' },
      { code: 'mice', name: 'Keyboards & Mice' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 88,
    },
    averageRating: 4.7,
    numberOfReviews: 245,
    classifications: [
      { code: 'sensorDpi', name: 'Sensor DPI', value: '8000 DPI' },
      { code: 'battery', name: 'Battery Life', value: 'Up to 70 days' },
    ],
    url: '/products/CONF-DEMO-003',
  },
  {
    code: 'CONF-DEMO-004',
    name: 'Dell UltraSharp 32 4K USB-C Hub Monitor',
    brand: 'Dell',
    summary: 'Brilliant color and contrast with groundbreaking IPS Black technology.',
    description: 'Be your most productive on a 31.5" 4K monitor with brilliant color and contrast that features industry-first IPS Black technology and a connectivity hub.',
    price: {
      currencyIso: 'USD',
      value: 719.99,
      formattedValue: '$719.99',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
        altText: 'Dell UltraSharp Monitor',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80',
        altText: 'Dell Monitor Thumbnail',
      },
    ],
    categories: [
      { code: 'monitors', name: 'Monitors & Displays' },
    ],
    stock: {
      stockLevelStatus: 'lowStock',
      stockLevel: 3,
    },
    averageRating: 4.6,
    numberOfReviews: 54,
    classifications: [
      { code: 'resolution', name: 'Resolution', value: '3840 x 2160 (4K UHD)' },
      { code: 'refreshRate', name: 'Refresh Rate', value: '60 Hz' },
    ],
    url: '/products/CONF-DEMO-004',
  },
  {
    code: 'CONF-DEMO-005',
    name: 'Bose QuietComfort Ultra Wireless Headphones',
    brand: 'Bose',
    summary: 'World-class noise cancellation, breakthrough spatial audio, and luxury design.',
    description: 'Bose QuietComfort Ultra Headphones take everything music makes you feel to new highs with world-class noise cancellation and Bose Immersive Audio.',
    price: {
      currencyIso: 'USD',
      value: 429.00,
      formattedValue: '$429.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
        altText: 'Bose QuietComfort Ultra Black',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&q=80',
        altText: 'Bose QuietComfort Thumbnail',
      },
    ],
    categories: [
      { code: 'audio', name: 'Audio & Sound' },
      { code: 'headphones', name: 'Headphones' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 25,
    },
    averageRating: 4.8,
    numberOfReviews: 94,
    classifications: [
      { code: 'spatialAudio', name: 'Spatial Audio', value: 'Yes' },
      { code: 'batteryLife', name: 'Battery Life', value: '24 Hours' },
    ],
    url: '/products/CONF-DEMO-005',
  },
  {
    code: 'CONF-DEMO-006',
    name: 'Apple AirPods Max - Space Gray',
    brand: 'Apple',
    summary: 'Computational audio with high-fidelity sound and Active Noise Cancellation.',
    description: 'AirPods Max reimagine over-ear headphones. An Apple-designed dynamic driver provides immersive high-fidelity audio.',
    price: {
      currencyIso: 'USD',
      value: 549.00,
      formattedValue: '$549.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
        altText: 'Apple AirPods Max Space Gray',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80',
        altText: 'AirPods Max Thumbnail',
      },
    ],
    categories: [
      { code: 'audio', name: 'Audio & Sound' },
      { code: 'headphones', name: 'Headphones' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 19,
    },
    averageRating: 4.7,
    numberOfReviews: 310,
    classifications: [
      { code: 'chip', name: 'Chip', value: 'Apple H1 Headphone Chip (each cup)' },
    ],
    url: '/products/CONF-DEMO-006',
  },
  {
    code: 'CONF-DEMO-007',
    name: 'Logitech MX Mechanical Wireless Keyboard',
    brand: 'Logitech',
    summary: 'Low-profile mechanical switches with smart illumination and multi-device pairing.',
    description: 'Feel every moment with MX Mechanical – a keyboard with exceptional feel, precision, and performance.',
    price: {
      currencyIso: 'USD',
      value: 169.99,
      formattedValue: '$169.99',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
        altText: 'Logitech MX Mechanical Keyboard',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=80',
        altText: 'MX Mechanical Thumbnail',
      },
    ],
    categories: [
      { code: 'accessories', name: 'Accessories' },
      { code: 'keyboards', name: 'Keyboards & Mice' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 55,
    },
    averageRating: 4.6,
    numberOfReviews: 142,
    classifications: [
      { code: 'switches', name: 'Switch Type', value: 'Tactile Quiet' },
      { code: 'battery', name: 'Battery Life', value: 'Up to 15 days (backlit)' },
    ],
    url: '/products/CONF-DEMO-007',
  },
  {
    code: 'CONF-DEMO-008',
    name: 'Dell XPS 15 OLED Laptop',
    brand: 'Dell',
    summary: 'Immersive 3.5K OLED InfinityEdge display with 13th Gen Intel Core processors.',
    description: 'Unleash your creativity with the stunning Dell XPS 15 featuring high performance and a cinematic OLED touch screen.',
    price: {
      currencyIso: 'USD',
      value: 2199.00,
      formattedValue: '$2,199.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
        altText: 'Dell XPS 15 Laptop',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&q=80',
        altText: 'Dell XPS 15 Thumbnail',
      },
    ],
    categories: [
      { code: 'computers', name: 'Computers & Tablets' },
      { code: 'laptops', name: 'Laptops' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 8,
    },
    averageRating: 4.5,
    numberOfReviews: 67,
    classifications: [
      { code: 'display', name: 'Display', value: '15.6" 3.5K OLED Touch' },
      { code: 'ram', name: 'Memory', value: '32 GB DDR5' },
    ],
    url: '/products/CONF-DEMO-008',
  },
  {
    code: 'CONF-DEMO-009',
    name: 'Samsung Odyssey Neo G9 49" Curved Gaming Monitor',
    brand: 'Samsung',
    summary: 'Dual QHD 1000R curved display with Quantum Mini-LED technology and 240Hz refresh rate.',
    description: 'Spellbinding visual quality with Quantum Matrix technology creates controlled brightness and perfect contrast for refined definition.',
    price: {
      currencyIso: 'USD',
      value: 1799.99,
      formattedValue: '$1,799.99',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        altText: 'Samsung Odyssey Neo G9',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80',
        altText: 'Odyssey Neo G9 Thumbnail',
      },
    ],
    categories: [
      { code: 'monitors', name: 'Monitors & Displays' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 12,
    },
    averageRating: 4.6,
    numberOfReviews: 89,
    classifications: [
      { code: 'resolution', name: 'Resolution', value: '5120 x 1440 Dual QHD' },
      { code: 'refreshRate', name: 'Refresh Rate', value: '240 Hz' },
    ],
    url: '/products/CONF-DEMO-009',
  },
  {
    code: 'CONF-DEMO-010',
    name: 'Sony WF-1000XM5 True Wireless Earbuds',
    brand: 'Sony',
    summary: 'The best truly wireless noise canceling earbuds with high-res audio wireless.',
    description: 'Astonishing sound quality, advanced noise canceling performance, and crystal-clear call quality packed into a compact, lightweight design.',
    price: {
      currencyIso: 'USD',
      value: 299.99,
      formattedValue: '$299.99',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
        altText: 'Sony WF-1000XM5 Earbuds',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80',
        altText: 'Sony WF Earbuds Thumbnail',
      },
    ],
    categories: [
      { code: 'audio', name: 'Audio & Sound' },
      { code: 'earbuds', name: 'Earbuds' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 60,
    },
    averageRating: 4.5,
    numberOfReviews: 174,
    classifications: [
      { code: 'batteryLife', name: 'Battery Life', value: '8h + 16h with case' },
      { code: 'waterproof', name: 'Water Resistance', value: 'IPX4' },
    ],
    url: '/products/CONF-DEMO-010',
  },
  {
    code: 'CONF-DEMO-011',
    name: 'Apple Magic Trackpad - Black',
    brand: 'Apple',
    summary: 'Wireless and rechargeable trackpad with full range of Multi-Touch gestures and Force Touch.',
    description: 'Magic Trackpad features a large edge-to-edge glass surface area, making scrolling and swiping through your favorite content more productive and comfortable.',
    price: {
      currencyIso: 'USD',
      value: 149.00,
      formattedValue: '$149.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
        altText: 'Apple Magic Trackpad Black',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80',
        altText: 'Magic Trackpad Thumbnail',
      },
    ],
    categories: [
      { code: 'accessories', name: 'Accessories' },
      { code: 'mice', name: 'Keyboards & Mice' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 34,
    },
    averageRating: 4.8,
    numberOfReviews: 82,
    classifications: [
      { code: 'connection', name: 'Connection', value: 'Bluetooth & Lightning/USB-C' },
    ],
    url: '/products/CONF-DEMO-011',
  },
  {
    code: 'CONF-DEMO-012',
    name: 'Bose SoundLink Flex Bluetooth Speaker',
    brand: 'Bose',
    summary: 'Portable outdoor speaker with rugged waterproof design and surprisingly deep bass.',
    description: 'Whether you are hanging out at the beach or hosting a dinner party, the SoundLink Flex brings clear, deep sound and powerful bass everywhere.',
    price: {
      currencyIso: 'USD',
      value: 149.00,
      formattedValue: '$149.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
        altText: 'Bose SoundLink Flex Speaker',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&q=80',
        altText: 'SoundLink Flex Thumbnail',
      },
    ],
    categories: [
      { code: 'audio', name: 'Audio & Sound' },
      { code: 'speakers', name: 'Speakers' },
    ],
    stock: {
      stockLevelStatus: 'outOfStock',
      stockLevel: 0,
    },
    averageRating: 4.9,
    numberOfReviews: 215,
    classifications: [
      { code: 'waterResistance', name: 'Durability', value: 'IP67 Waterproof & Dustproof' },
      { code: 'batteryLife', name: 'Battery Life', value: 'Up to 12 hours' },
    ],
    url: '/products/CONF-DEMO-012',
  },
];

export const apparelProducts: Product[] = [
  {
    code: 'APP-001',
    name: 'Classic Heritage Double-Breasted Trench Coat',
    brand: 'Burberry',
    summary: 'Iconic bespoke weatherproof cotton gabardine trench coat crafted in Castleford, Yorkshire.',
    description: 'A cornerstone of British fashion, the Classic Trench Coat is made from breathable cotton gabardine with signature vintage check lining, horn buttons, and calf-leather buckles.',
    price: {
      currencyIso: 'GBP',
      value: 890.00,
      formattedValue: '£890.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
        altText: 'Classic Heritage Trench Coat Honey',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80',
        altText: 'Trench Coat Thumbnail',
      },
    ],
    categories: [
      { code: 'clothing', name: 'Clothing' },
      { code: 'coats', name: 'Coats & Jackets' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 18,
    },
    averageRating: 4.9,
    numberOfReviews: 86,
    classifications: [
      { code: 'material', name: 'Material', value: '100% Cotton Gabardine' },
      { code: 'origin', name: 'Origin', value: 'Made in England' },
      { code: 'care', name: 'Care', value: 'Specialist dry clean' },
    ],
    url: '/products/APP-001',
  },
  {
    code: 'APP-002',
    name: 'Custom Slim Fit Oxford Cotton Shirt',
    brand: 'Ralph Lauren',
    summary: 'Classic button-down collar Oxford shirt with signature embroidered Pony on the chest.',
    description: 'An essential for refined casual styling, this Oxford shirt is tailored from breathable combed cotton for lasting comfort and timeless elegance.',
    price: {
      currencyIso: 'GBP',
      value: 125.00,
      formattedValue: '£125.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
        altText: 'Oxford Cotton Shirt Light Blue',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=80',
        altText: 'Oxford Shirt Thumbnail',
      },
    ],
    categories: [
      { code: 'clothing', name: 'Clothing' },
      { code: 'shirts', name: 'Shirts' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 45,
    },
    averageRating: 4.7,
    numberOfReviews: 142,
    classifications: [
      { code: 'material', name: 'Material', value: '100% Cotton' },
      { code: 'fit', name: 'Fit', value: 'Custom Slim Fit' },
    ],
    url: '/products/APP-002',
  },
  {
    code: 'APP-003',
    name: 'Handcrafted Goodyear-Welted Leather Chelsea Boots',
    brand: "Church's",
    summary: 'Refined calf leather Chelsea boots featuring elasticated side gussets and durable Dainite soles.',
    description: 'Expertly constructed in Northampton, these Chelsea boots combine polished calfskin leather with Goodyear welt construction for enduring resilience.',
    price: {
      currencyIso: 'GBP',
      value: 495.00,
      formattedValue: '£495.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80',
        altText: 'Leather Chelsea Boots Black',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=200&q=80',
        altText: 'Chelsea Boots Thumbnail',
      },
    ],
    categories: [
      { code: 'footwear', name: 'Footwear' },
      { code: 'boots', name: 'Boots' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 22,
    },
    averageRating: 4.8,
    numberOfReviews: 64,
    classifications: [
      { code: 'material', name: 'Upper', value: '100% Calf Leather' },
      { code: 'construction', name: 'Sole', value: 'Goodyear Welted Dainite' },
    ],
    url: '/products/APP-003',
  },
  {
    code: 'APP-004',
    name: 'Fine Knit Cashmere & Merino Crewneck Sweater',
    brand: 'John Smedley',
    summary: 'Ultra-soft 30-gauge knit crafted from premium Mongolian cashmere and extra-fine Merino wool.',
    description: 'A luxurious layering piece offering lightweight warmth and an exceptionally smooth handle, finished with ribbed trims.',
    price: {
      currencyIso: 'GBP',
      value: 295.00,
      formattedValue: '£295.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
        altText: 'Cashmere Knit Sweater Charcoal',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&q=80',
        altText: 'Knit Sweater Thumbnail',
      },
    ],
    categories: [
      { code: 'clothing', name: 'Clothing' },
      { code: 'knitwear', name: 'Knitwear' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 30,
    },
    averageRating: 4.9,
    numberOfReviews: 53,
    classifications: [
      { code: 'material', name: 'Blend', value: '50% Cashmere, 50% Merino' },
      { code: 'gauge', name: 'Knit Gauge', value: '30-Gauge Fine Knit' },
    ],
    url: '/products/APP-004',
  },
];

export const powertoolsProducts: Product[] = [
  {
    code: 'TOOL-001',
    name: 'Bosch Professional 18V Cordless Rotary Hammer Drill (GBH 18V-26)',
    brand: 'Bosch Professional',
    summary: 'High-performance SDS-plus rotary hammer with KickBack Control and electronic precision control.',
    description: 'Delivering 2.6 Joules of impact energy, the GBH 18V-26 provides professional-grade chiseling and drilling performance in reinforced concrete.',
    price: {
      currencyIso: 'EUR',
      value: 349.00,
      formattedValue: '€349.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
        altText: 'Bosch Rotary Hammer Drill',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&q=80',
        altText: 'Hammer Drill Thumbnail',
      },
    ],
    categories: [
      { code: 'powertools', name: 'Power Tools' },
      { code: 'drills', name: 'Drills & Drivers' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 50,
    },
    averageRating: 4.9,
    numberOfReviews: 198,
    classifications: [
      { code: 'voltage', name: 'Voltage', value: '18V Li-Ion' },
      { code: 'impactEnergy', name: 'Impact Energy', value: '2.6 Joules' },
      { code: 'chuck', name: 'Chuck Type', value: 'SDS-plus' },
    ],
    url: '/products/TOOL-001',
  },
  {
    code: 'TOOL-002',
    name: 'DeWalt 20V MAX XR Brushless 7-1/4" Circular Saw (DCS570)',
    brand: 'DeWalt',
    summary: 'Heavy-duty cordless circular saw with 5500 RPM brushless motor and bevel capacity up to 57 degrees.',
    description: 'Engineered for demanding job site cutting applications, this brushless circular saw delivers the power and depth of cut comparable to corded saws.',
    price: {
      currencyIso: 'EUR',
      value: 229.00,
      formattedValue: '€229.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80',
        altText: 'DeWalt Circular Saw',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&q=80',
        altText: 'Circular Saw Thumbnail',
      },
    ],
    categories: [
      { code: 'powertools', name: 'Power Tools' },
      { code: 'saws', name: 'Saws' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 35,
    },
    averageRating: 4.8,
    numberOfReviews: 114,
    classifications: [
      { code: 'bladeSize', name: 'Blade Diameter', value: '7-1/4 Inch (184 mm)' },
      { code: 'speed', name: 'No Load Speed', value: '5,500 RPM' },
    ],
    url: '/products/TOOL-002',
  },
  {
    code: 'TOOL-003',
    name: 'Makita 18V LXT Brushless 4-1/2" Angle Grinder (XAG04Z)',
    brand: 'Makita',
    summary: 'Automatic speed change technology adjusts speed and torque during grinding for optimum performance.',
    description: 'The Makita 18V Brushless 4-1/2" Angle Grinder delivers corded grinding performance without the cord, with electronic current limiter to protect from overload.',
    price: {
      currencyIso: 'EUR',
      value: 179.00,
      formattedValue: '€179.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
        altText: 'Makita Angle Grinder',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&q=80',
        altText: 'Angle Grinder Thumbnail',
      },
    ],
    categories: [
      { code: 'powertools', name: 'Power Tools' },
      { code: 'grinders', name: 'Grinders' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 40,
    },
    averageRating: 4.7,
    numberOfReviews: 89,
    classifications: [
      { code: 'wheelDiameter', name: 'Wheel Diameter', value: '4-1/2 Inch (115 mm)' },
      { code: 'batteryPlatform', name: 'Battery', value: '18V LXT Lithium-Ion' },
    ],
    url: '/products/TOOL-003',
  },
  {
    code: 'TOOL-004',
    name: 'Milwaukee M18 FUEL 4-Piece Industrial Combo Toolkit',
    brand: 'Milwaukee',
    summary: 'Includes Hammer Drill, 1/4" Hex Impact Driver, 6-1/2" Circular Saw, and LED Worklight.',
    description: 'The ultimate contractor kit featuring POWERSTATE brushless motors, REDLINK PLUS intelligence, and two 5.0Ah REDLITHIUM battery packs with PACKOUT tool case.',
    price: {
      currencyIso: 'EUR',
      value: 799.00,
      formattedValue: '€799.00',
      priceType: 'BUY',
    },
    images: [
      {
        format: 'product',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80',
        altText: 'Milwaukee Industrial Combo Kit',
      },
      {
        format: 'thumbnail',
        imageType: 'PRIMARY',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200&q=80',
        altText: 'Toolkit Thumbnail',
      },
    ],
    categories: [
      { code: 'powertools', name: 'Power Tools' },
      { code: 'toolkits', name: 'Combo Toolkits' },
    ],
    stock: {
      stockLevelStatus: 'inStock',
      stockLevel: 15,
    },
    averageRating: 5.0,
    numberOfReviews: 76,
    classifications: [
      { code: 'toolCount', name: 'Pieces Included', value: '4 Tools + 2x 5.0Ah Batteries' },
      { code: 'case', name: 'Storage', value: 'PACKOUT Heavy-Duty Case' },
    ],
    url: '/products/TOOL-004',
  },
];

export function getProductsForSite(siteId?: string): Product[] {
  if (siteId === 'apparel-uk') {
    return apparelProducts;
  }
  if (siteId === 'powertools-spa') {
    return powertoolsProducts;
  }
  return mockProducts;
}

export function getAllMockProducts(): Product[] {
  return [...mockProducts, ...apparelProducts, ...powertoolsProducts];
}
