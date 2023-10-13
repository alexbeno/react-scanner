/* eslint-disable @nx/enforce-module-boundaries */
import { ScanContext } from 'apps/client/context/scan.context';
import { useContext, useMemo } from 'react';
import { Edge, Node } from 'reactflow';

export type Nodes = Node[];
export const UseVisualizerEdges = () => {
  const { scan } = useContext(ScanContext);
  console.log('scan', scan);
  const edges: Edge[] = useMemo(
    () =>
      (scan?.groups || []).flatMap((group, key) => {
        return group.files.flatMap((f, key2) =>
          f.groups.map((g, key3) => ({
            id: `${g.dependencies.a}-${g.dependencies.b}-${key}-${key2}-${key3}`,
            source: `${g.dependencies.a}`,
            target: `${g.dependencies.b}`,
            animated: true,
            label: g.dependencies.b,
            style: { stroke: 'red' },
          })),
        );
      }),
    [scan],
  );

  return { initialEdges: edges };
  // return { initialEdges: [] };
};
