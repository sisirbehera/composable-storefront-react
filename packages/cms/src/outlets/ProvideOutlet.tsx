'use client';

import React, { useEffect } from 'react';
import { OutletPosition, OutletContextProps } from '@storefront/core';
import { useOutletRegistry } from './OutletContext';

export interface ProvideOutletProps<T = any> {
  name: string;
  position?: OutletPosition;
  priority?: number;
  component: React.ComponentType<OutletContextProps<T>>;
}

/**
 * Declarative component to inject an outlet into the registry.
 * Automatically unregisters when unmounted.
 */
export function ProvideOutlet<T = any>({
  name,
  position = OutletPosition.REPLACE,
  priority = 0,
  component,
}: ProvideOutletProps<T>): null {
  const { register } = useOutletRegistry();

  useEffect(() => {
    const unregister = register(name, component, position, priority);
    return () => {
      unregister();
    };
  }, [name, position, priority, component, register]);

  return null;
}
