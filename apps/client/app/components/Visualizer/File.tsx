import React from 'react';
import { Handle, Position } from 'reactflow';

function VisualizerFile({ data }: { data: { path: string; name: string } }) {
  return (
    <div className="h-[100%] w-[100%] bg-white">
      <Handle type="target" position={Position.Top} />
      <div className="h-full max-w-[100%] bg-white flex items-center justify-center">
        <p className="break-all">{data.name}</p>
        {/* <p className="break-all">{data.path}</p> */}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}

export default VisualizerFile;
