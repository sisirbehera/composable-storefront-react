import React from 'react';
import { OutletPosition, OutletRegistration, OutletContextProps } from '@storefront/core';

export class OutletService {
  private registrations: Map<string, OutletRegistration> = new Map();
  private listeners: Set<() => void> = new Set();
  private idCounter = 0;

  /**
   * Register a component to an outlet extension point.
   * Returns an unregister function for automatic cleanup.
   */
  register<T = any>(
    name: string,
    component: React.ComponentType<OutletContextProps<T>>,
    position: OutletPosition = OutletPosition.REPLACE,
    priority = 0
  ): () => void {
    const id = `outlet-reg-${++this.idCounter}-${name}`;
    const registration: OutletRegistration<T> = {
      id,
      name,
      position,
      component,
      priority,
    };

    this.registrations.set(id, registration);
    this.notify();

    return () => {
      this.unregister(id);
    };
  }

  /**
   * Unregister an outlet by ID.
   */
  unregister(id: string): void {
    if (this.registrations.delete(id)) {
      this.notify();
    }
  }

  /**
   * Get all registrations for a given outlet name and position, sorted by priority (descending).
   */
  getOutlets(name: string, position: OutletPosition): OutletRegistration[] {
    const results: OutletRegistration[] = [];
    for (const reg of this.registrations.values()) {
      if (reg.name === name && reg.position === position) {
        results.push(reg);
      }
    }
    return results.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Get the active REPLACE outlet for a given outlet name, if one exists.
   */
  getReplaceOutlet(name: string): OutletRegistration | undefined {
    const replaceOutlets = this.getOutlets(name, OutletPosition.REPLACE);
    return replaceOutlets.length > 0 ? replaceOutlets[0] : undefined;
  }

  /**
   * Check if any REPLACE outlet is registered for the specified outlet name.
   */
  hasReplaceOutlet(name: string): boolean {
    return this.getReplaceOutlet(name) !== undefined;
  }

  /**
   * Subscribe to registry changes (for React state synchronization).
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Clear all registered outlets (useful for testing and reset).
   */
  clear(): void {
    this.registrations.clear();
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in outlet service listener', err);
      }
    });
  }
}

// Global singleton instance matching Spartacus service pattern
export const outletService = new OutletService();
