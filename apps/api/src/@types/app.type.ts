import { ProjectMapFile } from './project-map.type';

export interface AppDependencies {
  a: string;
  b: string;
}

export interface AppFilesSubGroup {
  name: string;
  path: string;
  dependencies: AppDependencies;
}

export interface AppFiles extends ProjectMapFile {
  path: string;
  groups: AppFilesSubGroup[];
}

export interface AppGroups {
  name: string;
  path: string;
  files: AppFiles[];
}

export interface App {
  name: string;
  groups: AppGroups[];
  dependencies: App[];
}
