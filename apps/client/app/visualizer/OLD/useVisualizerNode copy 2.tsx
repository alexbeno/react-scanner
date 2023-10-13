/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { ProjectMapFile } from 'apps/client/@types/project-map.type';
import { ScanContext } from 'apps/client/context/scan.context';
import { useContext, useMemo } from 'react';
import { Node } from 'reactflow';
import { UseProjectMap } from './useProjectMap';
import { AppFiles, AppGroups } from 'apps/client/@types/app.type';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const GROUP_INNER_GAP = 30;
const NODE_GAP = 10;
const GROUP_GAP = 30;

export type Nodes = Node[];
export interface group extends Node<any> {
  nodes: Node<any>[];
}
export const UseVisualizerNode = () => {
  const { scan } = useContext(ScanContext);

  const sortedGroup: AppGroups[] = useMemo(() => {
    const findDepenciesNumber = (files: AppFiles[]) => {
      let sum = 0;

      files.forEach((file) => {
        // if (file.groups.length > 0) {
        //   sum += findDepenciesNumber(file.dependencies);
        // }
        sum += file.groups.length;
      });

      return sum;
    };

    return [...(scan?.groups || [])].sort((a, b) => {
      return findDepenciesNumber(b.files) - findDepenciesNumber(a.files);
    });
  }, [scan?.groups]);

  const groupedNodeToNode = useMemo(() => {
    const nodes: Node<any>[] = [];
    const groups: Node<any>[] = [];
    const nextGroupsPosition = {
      x: 0,
      y: 0,
    };

    (sortedGroup || []).forEach((group, key) => {
      const nodeGroup = {
        id: group.path,
        data: { path: group.path, name: group.name },
        type: 'folder',
        style: {
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        },
        position: { x: 0, y: 0 },
      };

      nodeGroup.style = {
        width: NODE_WIDTH + NODE_GAP + NODE_GAP,
        height:
          (NODE_HEIGHT + NODE_GAP) * group.files.length -
          1 +
          NODE_GAP +
          GROUP_INNER_GAP,
      };

      nodeGroup.position = {
        x: nextGroupsPosition.x + GROUP_GAP,
        y: nextGroupsPosition.y,
      };

      nextGroupsPosition.x +=
        ((nodeGroup?.style?.width as number) || 0) + GROUP_GAP;

      groups.push(nodeGroup);
      group.files.forEach((file, fileKey) => {
        nodes.push({
          id: file.path,
          data: { path: file.path, name: file.fileName },
          type: 'file',
          // parentNode: group.path,
          // extent: 'parent',
          style: {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
          },
          position: {
            x: NODE_GAP,
            y: (NODE_HEIGHT + NODE_GAP) * fileKey + NODE_GAP + GROUP_INNER_GAP,
          },
        });
      });
    });

    console.log([...nodes]);
    // return [...groups, ...nodes];
    return nodes;
  }, [sortedGroup]);

  console.log('groupedNodeToNode', groupedNodeToNode);

  return { initialNodes: groupedNodeToNode };
};
