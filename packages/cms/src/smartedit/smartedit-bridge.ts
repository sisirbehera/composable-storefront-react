import {
  SmartEditPerspective,
  SmartEditMessageEvent,
  SmartEditComponentUpdatePayload,
} from '@storefront/core';

type PerspectiveListener = (perspective: SmartEditPerspective) => void;
type ComponentUpdateListener = (payload: SmartEditComponentUpdatePayload) => void;
type ComponentRerenderListener = (uids: string[]) => void;

/**
 * SAP SmartEdit Bidirectional Bridge.
 * Handles the iframe postMessage contract between the SAP Commerce Cloud SmartEdit
 * Backoffice Container and this headless storefront application.
 */
export class SmartEditBridge {
  private static perspectiveListeners: Set<PerspectiveListener> = new Set();
  private static componentUpdateListeners: Set<ComponentUpdateListener> = new Set();
  private static rerenderListeners: Set<ComponentRerenderListener> = new Set();
  private static initialized = false;

  static isPreviewMode(): boolean {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return (
      urlParams.has('cmsTicketId') ||
      urlParams.has('smartEdit') ||
      window.self !== window.top
    );
  }

  static initialize(): void {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    // Listen for incoming messages from SmartEdit parent iframe
    window.addEventListener('message', this.handleMessage);

    if (this.isPreviewMode()) {
      console.info('[SmartEditBridge] Initializing SAP SmartEdit contract handshake...');
      // Notify parent frame (SmartEdit Backoffice) that the headless storefront is mounted
      this.sendToSmartEdit('SMARTEDIT_STOREFRONT_READY', {
        time: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    }
  }

  /**
   * Dispatches events to the parent SmartEdit iframe container.
   */
  static sendToSmartEdit(eventType: string, data?: any): void {
    if (typeof window === 'undefined') return;

    const message: SmartEditMessageEvent = {
      event: eventType,
      data,
    };

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, '*');
    }
  }

  /**
   * Handles incoming postMessages from SAP SmartEdit container.
   */
  private static handleMessage = (event: MessageEvent): void => {
    if (!event.data || typeof event.data !== 'object') return;

    const { event: eventType, data } = event.data as SmartEditMessageEvent;

    switch (eventType) {
      case 'SMARTEDIT_CHANGE_PERSPECTIVE': {
        const perspective = (data?.perspective as SmartEditPerspective) || 'PREVIEW';
        this.perspectiveListeners.forEach((l) => l(perspective));
        break;
      }

      case 'SMARTEDIT_UPDATE_COMPONENT_PROPERTIES': {
        if (data && data.uid) {
          this.componentUpdateListeners.forEach((l) =>
            l(data as SmartEditComponentUpdatePayload)
          );
        }
        break;
      }

      case 'SMARTEDIT_RE_RENDER_COMPONENTS': {
        const uids = Array.isArray(data?.componentUids)
          ? data.componentUids
          : data?.uid
          ? [data.uid]
          : [];
        this.rerenderListeners.forEach((l) => l(uids));
        break;
      }

      case 'SMARTEDIT_RELOAD_PAGE': {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        break;
      }

      default:
        break;
    }
  };

  // Subscription helpers
  static onPerspectiveChange(listener: PerspectiveListener): () => void {
    this.perspectiveListeners.add(listener);
    return () => {
      this.perspectiveListeners.delete(listener);
    };
  }

  static onComponentUpdate(listener: ComponentUpdateListener): () => void {
    this.componentUpdateListeners.add(listener);
    return () => {
      this.componentUpdateListeners.delete(listener);
    };
  }

  static onComponentRerender(listener: ComponentRerenderListener): () => void {
    this.rerenderListeners.add(listener);
    return () => {
      this.rerenderListeners.delete(listener);
    };
  }
}
