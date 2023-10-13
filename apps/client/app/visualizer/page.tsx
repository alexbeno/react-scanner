import React from 'react';
import VisualizerFlow from './OLD/VisualizerFlow';
import { UseVisualizerFiles } from './hooks/useVisualizerFiles';
import FilesNavigation from './containers/FilesNavigation';
import Flow from './containers/Flow';

export default async function Visualizer() {
  return (
    <div>
      <Flow />
      <FilesNavigation />
    </div>
  );
}
