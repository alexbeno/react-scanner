/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  App,
  AppFiles,
  AppFilesSubGroup,
  AppGroups,
} from '../../@types/app.type';
import {
  Dependencies,
  DependenciesType,
  Dependency,
} from '../../@types/dependencies.type';
import { ProjectMapFile } from '../../@types/project-map.type';
import { FileSystemsInterface } from '../files-system/files-system';

export interface DependenciesScannerProps {
  dependencies: Dependencies[];
  files: ProjectMapFile[];
}

export interface AppScannerGroupsInterface {
  createGroups(): AppGroups[];
}

export class AppScannerGroup implements AppScannerGroupsInterface {
  private dependencies: Dependencies[];
  private files: ProjectMapFile[];
  private groups: AppGroups[] = [];

  constructor(props: DependenciesScannerProps) {
    this.dependencies = props.dependencies;
    this.files = props.files;
  }

  private getGroupNameFromPath = (path: string) => {
    const pathSplit = path.split('/');
    if (pathSplit.length > 0) {
      pathSplit.pop();
    } else {
      return pathSplit[0].split('.').at(0) || 'root';
    }
    return pathSplit.join('/');
  };

  private findGroupByName = (name: string) => {
    return this.groups.find((group) => group.name === name);
  };

  private createGroup = (group: AppGroups) => {
    this.groups.push(group);
  };

  private addFileToGroup = (group: AppGroups, file: AppFiles) => {
    group.files.push(file);
  };

  private findFileDependencies = (file: ProjectMapFile) => {
    const dependencies =
      this.dependencies.find((d) => d.path === file.path)?.dependencies || [];
    const filtered = dependencies.filter(
      (d) => d.type === DependenciesType.INTERNAL,
    );
    return filtered.map((d) => this.findFileFromDepencies(d, file));
  };

  private findFileFromDepencies = (
    dependency: Dependency,
    currentFile: ProjectMapFile,
  ): AppFilesSubGroup => {
    const findFile = this.files.find((f) => f.path === dependency.path);
    if (findFile) {
      const groupName = this.getGroupNameFromPath(findFile.path);
      return {
        name: groupName || 'root',
        path: groupName || 'root',
        dependencies: {
          a: currentFile.path,
          b: findFile.path,
        },
      };
    }
  };

  createGroups() {
    this.files.forEach((file) => {
      const groupName = this.getGroupNameFromPath(file.path);
      const group = this.findGroupByName(groupName);

      if (group) {
        this.addFileToGroup(group, {
          ...file,
          groups: this.findFileDependencies(file),
        });
      } else {
        this.createGroup({
          name: groupName || 'root',
          path: groupName || 'root',
          files: [
            {
              ...file,
              groups: this.findFileDependencies(file),
            },
          ],
        });
      }
    });

    return this.groups;
  }
}
