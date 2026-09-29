export interface CmsComponent<T = Record<string, any>> {
  uid: string;
  typeCode: string;
  name?: string;
  modifiedTime?: string;
  properties: T;
}

export interface CmsSlot {
  slotId: string;
  position: string;
  name?: string;
  components: CmsComponent[];
}

export interface CmsPage {
  pageId: string;
  template: string;
  title?: string;
  description?: string;
  robotTag?: string;
  slots: Record<string, CmsSlot>;
}

export interface CmsPageContext {
  id: string;
  type: 'CONTENT_PAGE' | 'PRODUCT_PAGE' | 'CATEGORY_PAGE';
}

export interface BannerComponentProperties {
  headline?: string;
  content?: string;
  media?: {
    url: string;
    altText?: string;
  };
  urlLink?: string;
  external?: boolean;
}

export interface ProductCarouselComponentProperties {
  title?: string;
  productCodes: string[];
}

export interface ParagraphComponentProperties {
  content: string;
}

export interface FlexComponentProperties {
  flexType: string;
  [key: string]: any;
}

export interface LinkComponentProperties {
  linkName: string;
  url: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  styleClasses?: string;
  styleAttributes?: string;
}

export interface NavigationNodeEntry {
  itemId: string;
  itemType?: string;
  name?: string;
  url?: string;
  target?: string;
}

export interface NavigationNode {
  uid: string;
  title: string;
  children?: NavigationNode[];
  entries?: NavigationNodeEntry[];
}

export interface NavigationComponentProperties {
  navigationNode?: NavigationNode;
  styleClass?: string;
}

export interface CmsTabItem {
  id: string;
  title: string;
  content: string;
  typeCode?: string;
}

export interface TabContainerComponentProperties {
  title?: string;
  tabs: CmsTabItem[];
}

export interface VideoComponentProperties {
  videoUrl: string;
  title?: string;
  caption?: string;
  posterUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export interface RotatingImageBanner {
  headline?: string;
  subhead?: string;
  media: {
    url: string;
    altText?: string;
  };
  urlLink?: string;
  ctaText?: string;
}

export interface RotatingImagesComponentProperties {
  banners: RotatingImageBanner[];
  timeout?: number;
  effect?: 'fade' | 'slide';
}

// ==========================================
// SmartEdit Authoring Contract Models
// ==========================================

export type SmartEditPerspective =
  | 'PREVIEW'
  | 'BASIC_EDIT'
  | 'ADVANCED_EDIT'
  | 'PERSONALIZATION';

export interface SmartEditMessageEvent<T = any> {
  event: string;
  data?: T;
}

export interface SmartEditComponentUpdatePayload {
  uid: string;
  slotId?: string;
  typeCode: string;
  properties: Record<string, any>;
}

// ==========================================
// Spartacus-Style Outlet Customization Models
// ==========================================

export enum OutletPosition {
  BEFORE = 'before',
  REPLACE = 'replace',
  AFTER = 'after',
}

export interface OutletContextProps<T = any> {
  context?: T;
}

export interface OutletRegistration<T = any> {
  id: string;
  name: string;
  position: OutletPosition;
  component: any;
  priority?: number;
}


