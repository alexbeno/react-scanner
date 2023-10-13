/* eslint-disable @nx/enforce-module-boundaries */
import { ProjectMapFile } from 'apps/client/@types/project-map.type';
import { ScanContext } from 'apps/client/context/scan.context';
import { useContext, useMemo } from 'react';
import { Node } from 'reactflow';
import { UseProjectMap } from './useProjectMap';

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
  const { project } = UseProjectMap();

  const buildNodeObject = (project: ProjectMapFile, key: number): Node<any> => {
    return {
      id: project.path,
      data: { path: project.path, name: project.fileName },
      type: 'file',
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      },
      position: { x: 0, y: 0 },
    };
  };

  const buildGroupObject = (
    groups: group[],
    node: Node<any>,
  ): group | undefined => {
    const getGroupName = node.id.split('/')?.at(-2);
    const findGroup = groups.find((group) => group.id === getGroupName);

    if (getGroupName) {
      if (!findGroup) {
        groups.push({
          id: getGroupName,
          type: 'folder',
          data: { name: getGroupName },
          position: { x: 0, y: 0 },
          nodes: [
            {
              ...node,
              parentNode: getGroupName,
              extent: 'parent',
            },
          ],
          style: {
            width: 0,
            height: 0,
          },
        });
      }

      if (findGroup) {
        findGroup?.nodes.push({
          ...node,
          parentNode: getGroupName,
          extent: 'parent',
        });
      }
    }

    return findGroup;
  };

  const nodes: Node<any>[] = useMemo(
    () =>
      (scan?.projects || []).map((project, key) =>
        buildNodeObject(project, key),
      ),
    [scan],
  );

  const groupedNode: group[] = useMemo(() => {
    const groups: group[] = [];

    nodes.forEach((node, key) => buildGroupObject(groups, node));

    return groups;
  }, [nodes]);

  const groupedNodeToNode = useMemo(() => {
    const nodes: Node<any>[] = [];
    const nextPosition = {
      x: 0,
      y: 0,
    };
    groupedNode.forEach((group, key) => {
      group.style = {
        width: NODE_WIDTH + NODE_GAP + NODE_GAP,
        height:
          (NODE_HEIGHT + NODE_GAP) * group.nodes.length -
          1 +
          NODE_GAP +
          GROUP_INNER_GAP,
      };

      group.position = {
        x: nextPosition.x + GROUP_GAP,
        y: nextPosition.y,
      };

      nextPosition.x += ((group?.style?.width as number) || 0) + GROUP_GAP;

      nodes.push({
        ...group,
      });

      group.nodes.forEach((node, nodeKey) => {
        nodes.push({
          ...node,
          style: {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
          },
          position: {
            x: NODE_GAP,
            y: (NODE_HEIGHT + NODE_GAP) * nodeKey + NODE_GAP + GROUP_INNER_GAP,
          },
        });
      });
    });

    return nodes;
  }, [groupedNode]);

  return { initialNodes: groupedNodeToNode };
};
