import React from 'react';
import { Handle, Position } from 'reactflow';

function VisualizerFolder({ data }: { data: { path: string; name: string } }) {
  return (
    <div className="h-[100%] w-[100%] bg-black/10 border-[1px] border-black">
      <Handle type="target" position={Position.Top} />
      <div className="h-full max-w-[100%] flex items-start justify-start">
        <p className=" w-full pl-[10px] pt-[10px] break-all">{data.name}</p>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}

export default VisualizerFolder;
