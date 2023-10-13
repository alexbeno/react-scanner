'use client';

import React from 'react';
import { UseVisualizerFiles } from '../hooks/useVisualizerFiles';

function FilesNavigation() {
  const { files } = UseVisualizerFiles();
  return (
    <div className="bg-black inline-flex flex-col items-start justify-start w-auto fixed top-0 left-0 overflow-scroll h-screen">
      <div className="inline-flex flex-col items-start justify-start">
        {files?.map((file) => (
          <p className="text-white inline-flex" key={file.path}>
            {file.path}
          </p>
        ))}
      </div>
    </div>
  );
}

export default FilesNavigation;
