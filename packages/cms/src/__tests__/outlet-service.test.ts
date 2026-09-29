import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { OutletService } from '../outlets/OutletService';
import { OutletPosition } from '@storefront/core';

describe('OutletService (Spartacus-equivalent Template Customization)', () => {
  let service: OutletService;

  beforeEach(() => {
    service = new OutletService();
  });

  const DummyComponent: React.FC<any> = () => null;
  const HighPriorityComponent: React.FC<any> = () => null;

  it('registers and retrieves a REPLACE outlet', () => {
    service.register('ProductDetails.Summary', DummyComponent, OutletPosition.REPLACE);

    expect(service.hasReplaceOutlet('ProductDetails.Summary')).toBe(true);
    const outlet = service.getReplaceOutlet('ProductDetails.Summary');
    expect(outlet).toBeDefined();
    expect(outlet?.component).toBe(DummyComponent);
  });

  it('prioritizes higher priority REPLACE registrations', () => {
    service.register('ProductDetails.Summary', DummyComponent, OutletPosition.REPLACE, 10);
    service.register('ProductDetails.Summary', HighPriorityComponent, OutletPosition.REPLACE, 100);

    const active = service.getReplaceOutlet('ProductDetails.Summary');
    expect(active?.priority).toBe(100);
    expect(active?.component).toBe(HighPriorityComponent);
  });

  it('retrieves BEFORE and AFTER outlets in correct priority order', () => {
    service.register('Cart.Summary', DummyComponent, OutletPosition.BEFORE, 5);
    service.register('Cart.Summary', HighPriorityComponent, OutletPosition.BEFORE, 50);

    const beforeOutlets = service.getOutlets('Cart.Summary', OutletPosition.BEFORE);
    expect(beforeOutlets).toHaveLength(2);
    expect(beforeOutlets[0].priority).toBe(50);
    expect(beforeOutlets[1].priority).toBe(5);
  });

  it('unregisters an outlet using the returned cleanup handler', () => {
    const unregister = service.register('Header.Nav', DummyComponent, OutletPosition.REPLACE);
    expect(service.hasReplaceOutlet('Header.Nav')).toBe(true);

    unregister();
    expect(service.hasReplaceOutlet('Header.Nav')).toBe(false);
  });

  it('notifies subscribers upon registration and unregistration', () => {
    let callCount = 0;
    const unsubscribe = service.subscribe(() => {
      callCount++;
    });

    const unreg = service.register('Footer.Legal', DummyComponent);
    expect(callCount).toBe(1);

    unreg();
    expect(callCount).toBe(2);

    unsubscribe();
    service.register('Footer.Legal', DummyComponent);
    expect(callCount).toBe(2); // Listener unsubscribed, count remains 2
  });

  it('clears all registrations upon clear()', () => {
    service.register('Slot1', DummyComponent);
    service.register('Slot2', DummyComponent);
    service.clear();

    expect(service.hasReplaceOutlet('Slot1')).toBe(false);
    expect(service.hasReplaceOutlet('Slot2')).toBe(false);
  });
});
