'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { OutletPosition, OutletRegistration, OutletContextProps } from '@storefront/core';
import { OutletService, outletService as defaultService } from './OutletService';

export interface OutletContextValue {
  service: OutletService;
  version: number;
  register: <T = any>(
    name: string,
    component: React.ComponentType<OutletContextProps<T>>,
    position?: OutletPosition,
    priority?: number
  ) => () => void;
  isHighlightEnabled: boolean;
  setHighlightEnabled: (enabled: boolean) => void;
}

const OutletRegistryContext = createContext<OutletContextValue | null>(null);

// Context for child components rendered within an Outlet to access current outlet context
const OutletItemContext = createContext<any>(null);

export interface OutletProviderProps {
  children: React.ReactNode;
  service?: OutletService;
}

export const OutletProvider: React.FC<OutletProviderProps> = ({
  children,
  service = defaultService,
}) => {
  const [version, setVersion] = useState(0);
  const [isHighlightEnabled, setHighlightEnabled] = useState(false);

  useEffect(() => {
    // Listen for external registrations in outletService
    const unsubscribe = service.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return unsubscribe;
  }, [service]);

  const register = <T = any,>(
    name: string,
    component: React.ComponentType<OutletContextProps<T>>,
    position: OutletPosition = OutletPosition.REPLACE,
    priority = 0
  ) => {
    return service.register(name, component, position, priority);
  };

  return (
    <OutletRegistryContext.Provider
      value={{
        service,
        version,
        register,
        isHighlightEnabled,
        setHighlightEnabled,
      }}
    >
      {children}
    </OutletRegistryContext.Provider>
  );
};

export function useOutletRegistry(): OutletContextValue {
  const ctx = useContext(OutletRegistryContext);
  if (!ctx) {
    // Fallback to singleton service if Provider wasn't rendered higher up
    return {
      service: defaultService,
      version: 0,
      register: defaultService.register.bind(defaultService),
      isHighlightEnabled: false,
      setHighlightEnabled: () => {},
    };
  }
  return ctx;
}

export function useOutlet(name: string) {
  const { service, version, isHighlightEnabled } = useOutletRegistry();

  const before = service.getOutlets(name, OutletPosition.BEFORE);
  const replace = service.getReplaceOutlet(name);
  const after = service.getOutlets(name, OutletPosition.AFTER);

  return {
    before,
    replace,
    after,
    hasReplace: replace !== undefined,
    version,
    isHighlightEnabled,
  };
}

/**
 * Access the context object passed to the parent <Outlet context={...}>.
 * Equivalent to Spartacus OutletContext.
 */
export function useOutletContext<T = any>(): T {
  return useContext(OutletItemContext) as T;
}

export { OutletItemContext };
