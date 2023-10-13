'use client';

import { ScanContextProps, ScanProvider } from '../context/scan.context';

export function Providers({
  children,
  scanProvider,
}: {
  children: React.ReactNode;
  scanProvider: Omit<ScanContextProps, 'children'>;
}) {
  return <ScanProvider {...scanProvider}>{children}</ScanProvider>;
}
