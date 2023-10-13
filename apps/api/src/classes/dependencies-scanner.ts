/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dependencies } from '../@types/dependencies.type';
import { ProjectMapFile, ProjectMapFileType } from '../@types/project-map.type';
import { FileSystemsInterface } from './files-system/files-system';
import { ReactParser, ReactParserInterface } from './parser/React.parser';

export interface DependenciesScannerProps {
  fs: FileSystemsInterface;
}

export interface DependenciesScannerInterface {
  readFile(file: ProjectMapFile): any;
}

export class DependenciesScanner implements DependenciesScannerInterface {
  private fs: FileSystemsInterface;
  private reactParser: ReactParserInterface;

  constructor(props: DependenciesScannerProps) {
    this.fs = props.fs;
    this.reactParser = new ReactParser({ fs: props.fs });
  }

  private async getProjectMap(): Promise<ProjectMapFile[] | undefined> {
    return await this.fs.projectMap.readFile();
  }

  async readFile(file: ProjectMapFile): Promise<Dependencies | undefined> {
    const fileContent = await this.fs.source.readFile(file.path);

    if (
      file.type === ProjectMapFileType.REACT ||
      file.type === ProjectMapFileType.SCRIPT
    ) {
      const reactDependencies = await this.reactParser.getDependencies(
        fileContent,
        file.folder,
      );
      return {
        ...file,
        dependencies: reactDependencies,
      };
    }

    return undefined;
  }

  async createDependenciesMap() {
    const projectmap = await await this.getProjectMap();
    if (projectmap) {
      const getDepenciesAsync = await Promise.all(
        projectmap.map(async (f) => await this.readFile(f)),
      );

      await this.fs.dependencies.createFile(
        getDepenciesAsync.filter((d) => d !== undefined),
      );

      return getDepenciesAsync.filter((d) => d !== undefined);
    }

    return [];
  }
}
