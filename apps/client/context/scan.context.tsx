'user client';
import { createContext, useContext, useState } from 'react';
import { Scanne } from '../@types/scanne.type';

export interface ScanContextProps {
  children: React.ReactNode;
  scan: Scanne | undefined;
}

export interface ScanContextInterface {
  scan: Scanne | undefined;
  selectedFiles: string[];
}
export const ScanContext = createContext<ScanContextInterface>({
  scan: undefined,
  selectedFiles: [],
});

export const ScanProvider = ({ children, scan }: ScanContextProps) => {
  // const [selectedFiles, setSelectedFiles] = useState([
  //   'features/Home/Panel/Tab1/Tab1.tsx',
  //   'pages/Home/Home.tsx',
  // ]);
  const [selectedFiles, setSelectedFiles] = useState([
    'src/app/containers/Hubspot/InProgress/index.tsx',
  ]);

  return (
    <ScanContext.Provider value={{ scan, selectedFiles }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScanContext = () => {
  const context = useContext(ScanContext);

  return context;
};
