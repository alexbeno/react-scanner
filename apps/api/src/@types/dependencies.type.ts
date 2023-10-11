import { ProjectMapFileType } from './project-map.type';

export enum DependenciesType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export interface Dependency {
  path: string;
  name: string;
  type: DependenciesType;
}

export interface Dependencies {
  path: string;
  type: ProjectMapFileType;
  dependencies: Dependency[];
}
