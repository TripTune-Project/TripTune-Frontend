import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

export const dynamicImport = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    loading?: () => JSX.Element;
    ssr?: boolean;
  }
) => {
  return dynamic(importFunc, {
    loading: options?.loading,
    ssr: options?.ssr ?? true,
  });
}; 