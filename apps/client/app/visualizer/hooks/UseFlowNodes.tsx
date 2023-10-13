/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { useMemo } from 'react';
import {
  UseDependencies,
  getFilesAndDepenciesInterface,
} from './UseDependencies';
import { Edge, Node } from 'reactflow';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const GROUP_INNER_GAP = 30;
const NODE_GAP = 20;
const NODE_GAP_H = 100;
const GROUP_GAP = 30;

interface positions {
  path: string;
  x: number;
  y: number;
  w: number;
  childs: positions[];
}

interface createNodeProps {
  path: string;
  position: positions;
  nodes: Node<unknown>[];
  edges: Edge<unknown>[];
}

interface createDeepNodeProps {
  parentPath: string;
  position: positions;
  deep: getFilesAndDepenciesInterface[];
  nodes: Node<unknown>[];
  edges: Edge<unknown>[];
}

export const UseFlowNodes = () => {
  const { dependencies } = UseDependencies();

  const totalWidth = (file: getFilesAndDepenciesInterface) => {
    let sum = NODE_WIDTH;

    file.deep.forEach((deep) => {
      if (deep.deep.length > 1) {
        deep.deep.forEach((d) => {
          sum += totalWidth(d);
        });
      }
      sum += NODE_WIDTH + NODE_GAP;
    });

    return sum === NODE_WIDTH ? sum : sum - NODE_WIDTH - NODE_GAP;
  };
  const createNode = ({ position, path, nodes }: createNodeProps) => {
    // const nodeWidth =
    const previousChild = position.childs.at(-1);
    const node = {
      id: path,
      data: { path: path, name: path },
      type: 'file',
      style: {
        width: position.w,
        height: NODE_HEIGHT,
      },
      position: { x: 0, y: 0 },
    };

    // node.position = {
    //   x: (previousChild?.x || position.x) + GROUP_GAP + NODE_WIDTH,
    //   y: (previousChild?.y || position.y) + GROUP_GAP + NODE_HEIGHT,
    // };
    node.position = {
      x: position.x,
      y: position.y,
    };

    // position.childs.push({
    //   path: path,
    //   childs: [],
    //   w: node.style.width,
    //   ...node.position,
    // });

    nodes.push(node);
  };

  const createDeepNode = ({
    deep,
    parentPath,
    position,
    nodes,
    edges,
  }: createDeepNodeProps) => {
    if (deep.length > 0) {
      deep.forEach((_deep, key) => {
        if (_deep.files) {
          const childX = position.childs.at(-1)?.x || position.x;
          const childY =
            position.childs.at(-1)?.y || position.y + NODE_HEIGHT + NODE_GAP_H;
          const childW = position.childs.at(-1)?.w || 0;
          const x = childX + childW;
          const childPosition: positions = {
            x: x > 0 && x > position.x ? x + NODE_GAP : x,
            y: childY,
            w: totalWidth(_deep),
            path: _deep.files.path,
            childs: [],
          };
          position.childs.push(childPosition);

          edges.push({
            id: `${parentPath}-${_deep.files.path}`,
            source: `${parentPath}`,
            target: `${_deep.files.path}`,
            animated: true,
            // label: _deep.files.path,
            style: { stroke: 'red' },
          });

          createNode({
            edges: edges,
            position: position.childs[key],
            nodes: nodes,
            path: _deep.files.path,
          });
          createDeepNode({
            edges: edges,
            deep: _deep.deep,
            parentPath: _deep.files.path,
            position: position.childs[key],
            nodes: nodes,
          });
        }
      });
    }
  };

  const nodes = useMemo(() => {
    const nodes: Node<unknown>[] = [];
    const edges: Edge<unknown>[] = [];
    const positions: positions[] = [];

    dependencies.forEach((dependency, key) => {
      if (dependency.files) {
        positions.push({
          path: dependency.files.path,
          x: 0,
          y: 0,
          w: totalWidth(dependency),
          childs: [],
        });
        createNode({
          edges: edges,
          position: positions[0],
          nodes: nodes,
          path: dependency.files.path,
        });
        createDeepNode({
          edges: edges,
          deep: dependency.deep,
          parentPath: dependency.files.path,
          position: positions[0],
          nodes: nodes,
        });
      }
    });

    console.log('positions', positions);

    return { nodes, egdes: edges };
  }, [dependencies]);

  console.log('dependencies', dependencies);

  return { initialNodes: nodes.nodes, initialEdges: nodes.egdes };
};

// A : {
//   w: 200
//   x: 0,
//   y: 0
// }

// AB : {
//   w: 200
//   x: 200*6,
//   y: 0
// }

// 200
