'use client';

/* eslint-disable @nx/enforce-module-boundaries */
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import 'reactflow/dist/style.css';
import VisualizerFile from '../components/Visualizer/File';
import { UseVisualizerNode } from './useVisualizerNode';
import VisualizerFolder from '../components/Visualizer/Folder';
import { UseVisualizerEdges } from './useVisualizerEdges';

const rfStyle = {
  backgroundColor: '#D0C0F7',
};

function VisualizerFlow() {
  const { initialEdges } = UseVisualizerEdges();
  const { initialNodes } = UseVisualizerNode();
  const nodeTypes = useMemo(
    () => ({ file: VisualizerFile, folder: VisualizerFolder }),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={rfStyle}
        attributionPosition="top-right"
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default VisualizerFlow;
