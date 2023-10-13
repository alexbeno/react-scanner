/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { ScanContext } from 'apps/client/context/scan.context';
import { useContext } from 'react';

export const UseVisualizerFiles = () => {
  const { scan } = useContext(ScanContext);

  return { files: scan?.projects };
};
