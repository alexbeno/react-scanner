/* eslint-disable @typescript-eslint/no-explicit-any */

import { App } from '../../@types/app.type';
import { Dependencies, DependenciesType } from '../../@types/dependencies.type';
import {
  ProjectMapFile,
  ProjectMapFileType,
} from '../../@types/project-map.type';
import { FileSystemsInterface } from '../files-system/files-system';
import { ReactParser, ReactParserInterface } from '../parser/React.parser';
import {
  AppScannerGroup,
  AppScannerGroupsInterface,
} from './app-scanner-group';

export interface DependenciesScannerProps {
  fs: FileSystemsInterface;
  dependencies: Dependencies[];
  files: ProjectMapFile[];
}

export interface AppScannerInterface {
  createApp(): any;
}

export class AppScanner implements AppScannerInterface {
  private fs: FileSystemsInterface;
  private dependencies: Dependencies[];
  private files: ProjectMapFile[];
  private apps: App[] = [];
  private groupsScanner: AppScannerGroupsInterface;

  constructor(props: DependenciesScannerProps) {
    this.fs = props.fs;
    this.dependencies = props.dependencies;
    this.files = props.files;
    this.groupsScanner = new AppScannerGroup({
      dependencies: this.dependencies,
      files: this.files,
    });
  }

  private getDependenciesByPath(path: string) {
    const dependencies =
      this.dependencies.find((d) => d.path === path)?.dependencies || [];

    return dependencies.filter((d) => d.type === DependenciesType.INTERNAL);
  }

  async createApp() {
    const groups = this.groupsScanner.createGroups();
    console.log('OUIIIIII 1');
    await this.fs.groups.createFile(groups);
    console.log('OUIIIIII');
    return groups;
  }
}
