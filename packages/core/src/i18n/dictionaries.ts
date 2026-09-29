import { BaseSite, Currency, Language } from '../models/site-context.model';
import { Price } from '../models/product.model';

export interface TranslationDictionary {
  common: {
    search: string;
    searchPlaceholder: string;
    home: string;
    browseAll: string;
    signIn: string;
    signOut: string;
    myAccount: string;
    cart: string;
    store: string;
    language: string;
    currency: string;
    loading: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    default: string;
    close: string;
    viewDetails: string;
  };
  product: {
    sku: string;
    inStock: string;
    lowStock: string;
    outOfStock: string;
    addToCart: string;
    addingToCart: string;
    specifications: string;
    reviews: string;
    rating: string;
    qty: string;
  };
  cart: {
    cartTitle: string;
    emptyCart: string;
    emptyCartMsg: string;
    subtotal: string;
    delivery: string;
    tax: string;
    total: string;
    applyCoupon: string;
    couponPlaceholder: string;
    checkout: string;
    loadSampleItems: string;
    continueShopping: string;
  };
  checkout: {
    deliveryAddress: string;
    deliveryMode: string;
    paymentMethod: string;
    orderReview: string;
    placeOrder: string;
    continueReview: string;
    orderSuccess: string;
    orderNumber: string;
    thankYou: string;
  };
  account: {
    dashboard: string;
    orderHistory: string;
    addressBook: string;
    paymentMethods: string;
    profile: string;
    recentOrders: string;
    primaryAddress: string;
    primaryPayment: string;
    welcomeBack: string;
  };
}

export const DICTIONARIES: Record<string, TranslationDictionary> = {
  en: {
    common: {
      search: 'Search',
      searchPlaceholder: 'Search headphones, cameras, laptops...',
      home: 'Home',
      browseAll: 'Browse All',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      myAccount: 'My Account',
      cart: 'Cart',
      store: 'Store',
      language: 'Language',
      currency: 'Currency',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      default: 'Default',
      close: 'Close',
      viewDetails: 'View Details',
    },
    product: {
      sku: 'SKU',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      addToCart: 'Add to Cart',
      addingToCart: 'Adding...',
      specifications: 'Specifications',
      reviews: 'Reviews',
      rating: 'Rating',
      qty: 'Quantity',
    },
    cart: {
      cartTitle: 'Your Shopping Cart',
      emptyCart: 'Your cart is empty',
      emptyCartMsg: 'Explore our catalog and find amazing tech products.',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      tax: 'Estimated Taxes (8%)',
      total: 'Total',
      applyCoupon: 'Apply Code',
      couponPlaceholder: 'Enter promo code (e.g. SAVE20)',
      checkout: 'Proceed to Checkout',
      loadSampleItems: 'Load Sample Items',
      continueShopping: 'Continue Shopping',
    },
    checkout: {
      deliveryAddress: 'Delivery Address',
      deliveryMode: 'Delivery Mode',
      paymentMethod: 'Payment Details',
      orderReview: 'Order Review',
      placeOrder: 'Place Order Now',
      continueReview: 'Continue to Review',
      orderSuccess: 'Order Confirmed',
      orderNumber: 'Order Number',
      thankYou: 'Thank you for your order!',
    },
    account: {
      dashboard: 'Account Dashboard',
      orderHistory: 'Order History',
      addressBook: 'Address Book',
      paymentMethods: 'Payment Details',
      profile: 'Personal Details',
      recentOrders: 'Recent Orders',
      primaryAddress: 'Primary Delivery Address',
      primaryPayment: 'Primary Payment Method',
      welcomeBack: 'Welcome back',
    },
  },
  de: {
    common: {
      search: 'Suchen',
      searchPlaceholder: 'Kopfhörer, Kameras, Laptops suchen...',
      home: 'Startseite',
      browseAll: 'Alle Durchsuchen',
      signIn: 'Anmelden',
      signOut: 'Abmelden',
      myAccount: 'Mein Konto',
      cart: 'Warenkorb',
      store: 'Geschäft',
      language: 'Sprache',
      currency: 'Währung',
      loading: 'Wird geladen...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      default: 'Standard',
      close: 'Schließen',
      viewDetails: 'Details anzeigen',
    },
    product: {
      sku: 'Artikelnr.',
      inStock: 'Auf Lager',
      lowStock: 'Geringer Bestand',
      outOfStock: 'Ausverkauft',
      addToCart: 'In den Warenkorb',
      addingToCart: 'Wird hinzugefügt...',
      specifications: 'Spezifikationen',
      reviews: 'Bewertungen',
      rating: 'Bewertung',
      qty: 'Menge',
    },
    cart: {
      cartTitle: 'Ihr Warenkorb',
      emptyCart: 'Ihr Warenkorb ist leer',
      emptyCartMsg: 'Entdecken Sie unseren Katalog für großartige Technologieprodukte.',
      subtotal: 'Zwischensumme',
      delivery: 'Lieferung',
      tax: 'Geschätzte Steuern (8%)',
      total: 'Gesamtsumme',
      applyCoupon: 'Gutschein anwenden',
      couponPlaceholder: 'Aktionscode eingeben (z. B. SAVE20)',
      checkout: 'Zur Kasse',
      loadSampleItems: 'Beispielartikel laden',
      continueShopping: 'Weiter einkaufen',
    },
    checkout: {
      deliveryAddress: 'Lieferadresse',
      deliveryMode: 'Lieferart',
      paymentMethod: 'Zahlungsdetails',
      orderReview: 'Bestellübersicht',
      placeOrder: 'Jetzt zahlungspflichtig bestellen',
      continueReview: 'Weiter zur Übersicht',
      orderSuccess: 'Bestellung bestätigt',
      orderNumber: 'Bestellnummer',
      thankYou: 'Vielen Dank für Ihre Bestellung!',
    },
    account: {
      dashboard: 'Konto-Übersicht',
      orderHistory: 'Bestellverlauf',
      addressBook: 'Adressbuch',
      paymentMethods: 'Zahlungsarten',
      profile: 'Persönliche Daten',
      recentOrders: 'Letzte Bestellungen',
      primaryAddress: 'Standard-Lieferadresse',
      primaryPayment: 'Standard-Zahlungsart',
      welcomeBack: 'Willkommen zurück',
    },
  },
  fr: {
    common: {
      search: 'Rechercher',
      searchPlaceholder: 'Casques, appareils photo, ordinateurs...',
      home: 'Accueil',
      browseAll: 'Tout Parcourir',
      signIn: 'Connexion',
      signOut: 'Déconnexion',
      myAccount: 'Mon Compte',
      cart: 'Panier',
      store: 'Boutique',
      language: 'Langue',
      currency: 'Devise',
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      default: 'Par défaut',
      close: 'Fermer',
      viewDetails: 'Voir les détails',
    },
    product: {
      sku: 'Réf.',
      inStock: 'En stock',
      lowStock: 'Stock faible',
      outOfStock: 'Rupture de stock',
      addToCart: 'Ajouter au panier',
      addingToCart: 'Ajout en cours...',
      specifications: 'Spécifications',
      reviews: 'Avis',
      rating: 'Évaluation',
      qty: 'Quantité',
    },
    cart: {
      cartTitle: 'Votre Panier',
      emptyCart: 'Votre panier est vide',
      emptyCartMsg: 'Découvrez notre catalogue et trouvez des produits d’exception.',
      subtotal: 'Sous-total',
      delivery: 'Livraison',
      tax: 'Taxes estimées (8%)',
      total: 'Total',
      applyCoupon: 'Appliquer le code',
      couponPlaceholder: 'Code promo (ex: SAVE20)',
      checkout: 'Passer la commande',
      loadSampleItems: 'Charger des articles témoins',
      continueShopping: 'Poursuivre les achats',
    },
    checkout: {
      deliveryAddress: 'Adresse de livraison',
      deliveryMode: 'Mode de livraison',
      paymentMethod: 'Détails du paiement',
      orderReview: 'Récapitulatif de la commande',
      placeOrder: 'Confirmer la commande',
      continueReview: 'Continuer vers le récapitulatif',
      orderSuccess: 'Commande confirmée',
      orderNumber: 'Numéro de commande',
      thankYou: 'Merci pour votre commande !',
    },
    account: {
      dashboard: 'Tableau de bord',
      orderHistory: 'Historique des commandes',
      addressBook: 'Carnet d’adresses',
      paymentMethods: 'Moyens de paiement',
      profile: 'Informations personnelles',
      recentOrders: 'Commandes récentes',
      primaryAddress: 'Adresse de livraison principale',
      primaryPayment: 'Moyen de paiement principal',
      welcomeBack: 'Bienvenue',
    },
  },
  ja: {
    common: {
      search: '検索',
      searchPlaceholder: 'ヘッドフォン、カメラ、ノートPCを検索...',
      home: 'ホーム',
      browseAll: 'すべての商品',
      signIn: 'ログイン',
      signOut: 'ログアウト',
      myAccount: 'マイアカウント',
      cart: 'カート',
      store: 'ストア',
      language: '言語',
      currency: '通貨',
      loading: '読み込み中...',
      save: '保存',
      cancel: 'キャンセル',
      edit: '編集',
      delete: '削除',
      default: 'デフォルト',
      close: '閉じる',
      viewDetails: '詳細を見る',
    },
    product: {
      sku: '商品コード',
      inStock: '在庫あり',
      lowStock: '残りわずか',
      outOfStock: '在庫切れ',
      addToCart: 'カートに追加',
      addingToCart: '追加中...',
      specifications: '仕様',
      reviews: 'レビュー',
      rating: '評価',
      qty: '数量',
    },
    cart: {
      cartTitle: 'ショッピングカート',
      emptyCart: 'カートは空です',
      emptyCartMsg: '最新のテクノロジー商品カタログをご覧ください。',
      subtotal: '小計',
      delivery: '配送料',
      tax: '概算消費税 (8%)',
      total: '合計',
      applyCoupon: '適用',
      couponPlaceholder: 'プロモコードを入力 (例: SAVE20)',
      checkout: '注文手続きへ進む',
      loadSampleItems: 'サンプル商品を追加',
      continueShopping: '買い物を続ける',
    },
    checkout: {
      deliveryAddress: 'お届け先住所',
      deliveryMode: '配送方法',
      paymentMethod: 'お支払い情報',
      orderReview: 'ご注文の確認',
      placeOrder: '注文を確定する',
      continueReview: '確認へ進む',
      orderSuccess: 'ご注文が確定しました',
      orderNumber: '注文番号',
      thankYou: 'ご注文いただき誠にありがとうございます！',
    },
    account: {
      dashboard: 'アカウントダッシュボード',
      orderHistory: '注文履歴',
      addressBook: 'アドレス帳',
      paymentMethods: 'お支払い方法',
      profile: '会員情報',
      recentOrders: '最近の注文',
      primaryAddress: '既定のお届け先',
      primaryPayment: '既定のお支払い方法',
      welcomeBack: 'おかえりなさい',
    },
  },
  es: {
    common: {
      search: 'Buscar',
      searchPlaceholder: 'Buscar auriculares, cámaras, portátiles...',
      home: 'Inicio',
      browseAll: 'Ver Todo',
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
      myAccount: 'Mi Cuenta',
      cart: 'Carrito',
      store: 'Tienda',
      language: 'Idioma',
      currency: 'Moneda',
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      default: 'Predeterminado',
      close: 'Cerrar',
      viewDetails: 'Ver Detalles',
    },
    product: {
      sku: 'SKU',
      inStock: 'En Stock',
      lowStock: 'Pocas Unidades',
      outOfStock: 'Agotado',
      addToCart: 'Añadir al Carrito',
      addingToCart: 'Añadiendo...',
      specifications: 'Especificaciones',
      reviews: 'Opiniones',
      rating: 'Valoración',
      qty: 'Cantidad',
    },
    cart: {
      cartTitle: 'Tu Carrito',
      emptyCart: 'Tu carrito está vacío',
      emptyCartMsg: 'Explora nuestro catálogo y descubre productos de tecnología.',
      subtotal: 'Subtotal',
      delivery: 'Envío',
      tax: 'Impuestos estimados (8%)',
      total: 'Total',
      applyCoupon: 'Aplicar Código',
      couponPlaceholder: 'Introduce código (ej: SAVE20)',
      checkout: 'Tramitar Pedido',
      loadSampleItems: 'Cargar Artículos de Muestra',
      continueShopping: 'Continuar Comprando',
    },
    checkout: {
      deliveryAddress: 'Dirección de Envío',
      deliveryMode: 'Método de Envío',
      paymentMethod: 'Datos de Pago',
      orderReview: 'Revisión del Pedido',
      placeOrder: 'Realizar Pedido',
      continueReview: 'Continuar a Revisión',
      orderSuccess: 'Pedido Confirmado',
      orderNumber: 'Número de Pedido',
      thankYou: '¡Gracias por tu pedido!',
    },
    account: {
      dashboard: 'Panel de Control',
      orderHistory: 'Historial de Pedidos',
      addressBook: 'Libreta de Direcciones',
      paymentMethods: 'Métodos de Pago',
      profile: 'Datos Personales',
      recentOrders: 'Pedidos Recientes',
      primaryAddress: 'Dirección de Envío Principal',
      primaryPayment: 'Método de Pago Principal',
      welcomeBack: 'Bienvenido de nuevo',
    },
  },
};

export const DEFAULT_LANGUAGES: Language[] = [
  { isocode: 'en', name: 'English', nativeName: 'English', active: true },
  { isocode: 'de', name: 'German', nativeName: 'Deutsch', active: true },
  { isocode: 'fr', name: 'French', nativeName: 'Français', active: true },
  { isocode: 'ja', name: 'Japanese', nativeName: '日本語', active: true },
  { isocode: 'es', name: 'Spanish', nativeName: 'Español', active: true },
];

export const DEFAULT_CURRENCIES: Currency[] = [
  { isocode: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, active: true },
  { isocode: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, active: true },
  { isocode: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, active: true },
  { isocode: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 155.0, active: true },
];

export const DEFAULT_BASE_SITES: BaseSite[] = [
  {
    uid: 'electronics-spa',
    name: 'Electronics Store',
    defaultLanguage: 'en',
    languages: DEFAULT_LANGUAGES,
    defaultCurrency: 'USD',
    currencies: DEFAULT_CURRENCIES,
    channel: 'B2C',
    theme: 'spartacus-blue',
  },
  {
    uid: 'apparel-uk',
    name: 'Apparel & Fashion UK',
    defaultLanguage: 'en',
    languages: [DEFAULT_LANGUAGES[0], DEFAULT_LANGUAGES[2], DEFAULT_LANGUAGES[1]], // en, fr, de
    defaultCurrency: 'GBP',
    currencies: [DEFAULT_CURRENCIES[2], DEFAULT_CURRENCIES[1], DEFAULT_CURRENCIES[0]], // GBP, EUR, USD
    channel: 'B2C',
    theme: 'spartacus-emerald',
  },
  {
    uid: 'powertools-spa',
    name: 'Industrial Powertools B2B',
    defaultLanguage: 'de',
    languages: [DEFAULT_LANGUAGES[1], DEFAULT_LANGUAGES[0]], // de, en
    defaultCurrency: 'EUR',
    currencies: [DEFAULT_CURRENCIES[1], DEFAULT_CURRENCIES[0]], // EUR, USD
    channel: 'B2B',
    theme: 'spartacus-amber',
  },
];

export function translate(key: string, lang = 'en', params?: Record<string, string | number>): string {
  const dict = DICTIONARIES[lang] || DICTIONARIES['en'];
  const parts = key.split('.');

  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      let fallback: any = DICTIONARIES['en'];
      for (const fPart of parts) {
        if (fallback && typeof fallback === 'object' && fPart in fallback) {
          fallback = fallback[fPart];
        } else {
          return key;
        }
      }
      current = fallback;
      break;
    }
  }

  let text = typeof current === 'string' ? current : key;
  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal));
    });
  }

  return text;
}

export function convertAndFormatPrice(
  amount: number | Price | undefined | null,
  targetCurrency: Currency,
  baseCurrency?: Currency,
  locale = 'en'
): string {
  if (amount === undefined || amount === null) return '';

  let baseValue = 0;
  let baseIso = 'USD';

  if (typeof amount === 'number') {
    baseValue = amount;
  } else {
    baseValue = amount.value || 0;
    baseIso = amount.currencyIso || 'USD';
  }

  const baseRate = baseCurrency?.rate || DEFAULT_CURRENCIES.find((c) => c.isocode === baseIso)?.rate || 1.0;
  const targetRate = targetCurrency.rate || 1.0;

  const usdValue = baseValue / baseRate;
  const convertedValue = usdValue * targetRate;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: targetCurrency.isocode,
      minimumFractionDigits: targetCurrency.isocode === 'JPY' ? 0 : 2,
      maximumFractionDigits: targetCurrency.isocode === 'JPY' ? 0 : 2,
    }).format(convertedValue);
  } catch {
    return `${targetCurrency.symbol}${convertedValue.toFixed(targetCurrency.isocode === 'JPY' ? 0 : 2)}`;
  }
}
