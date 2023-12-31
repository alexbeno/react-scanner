import {
  DependenciesMapFs,
  DependenciesMapFsInterface,
} from './dependencies-map.fs';
import { DuplicateCodeFs, DuplicateCodeFsInterface } from './duplicate-code.fs';
import { groupsMapFs } from './groups-map.fs';
import { ProjectMapFs, ProjectMapFsInterface } from './project-map.fs';
import { SourceMapFs, SourceMapFsInterface } from './source-map.fs';

export interface FileSystemProps {
  id: string;
  base: string;
}

export interface FileSystemsInterface {
  projectMap: ProjectMapFsInterface;
  source: SourceMapFsInterface;
  duplicateCode: DuplicateCodeFsInterface;
  dependencies: DependenciesMapFsInterface;
  groups: groupsMapFs;
  base: string;
  id: string;
}

export class FileSystem implements FileSystemsInterface {
  id: string;
  base: string;
  jsonFile: {
    name: string;
    path: string;
  };

  projectMap: ProjectMapFsInterface;
  dependencies: DependenciesMapFsInterface;
  duplicateCode: DuplicateCodeFsInterface;
  source: SourceMapFsInterface;
  groups: groupsMapFs;

  constructor(props: FileSystemProps) {
    this.id = props.id;
    this.base = props.base;
    this.projectMap = new ProjectMapFs(props);
    this.source = new SourceMapFs(props);
    this.dependencies = new DependenciesMapFs(props);
    this.groups = new groupsMapFs(props);
    this.duplicateCode = new DuplicateCodeFs(props);
  }
}
