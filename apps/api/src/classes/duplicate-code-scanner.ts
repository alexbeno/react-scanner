/* eslint-disable @typescript-eslint/no-explicit-any */

import { IClone } from '@jscpd/core';
import { Dependencies } from '../@types/dependencies.type';
import { ProjectMapFile, ProjectMapFileType } from '../@types/project-map.type';
import { FileSystemsInterface } from './files-system/files-system';
import { ReactParser, ReactParserInterface } from './parser/React.parser';
import { jscpd } from 'jscpd';

export interface DuplicateCodeScannerProps {
  fs: FileSystemsInterface;
}

export interface DuplicateCodeScannerInterface {
  readFile(file: ProjectMapFile): any;
}

export class DuplicateCodeScanner implements DuplicateCodeScannerInterface {
  private fs: FileSystemsInterface;
  private reactParser: ReactParserInterface;

  constructor(props: DuplicateCodeScannerProps) {
    this.fs = props.fs;
    this.reactParser = new ReactParser({ fs: props.fs });
  }

  private async getProjectMap(): Promise<ProjectMapFile[] | undefined> {
    return await this.fs.projectMap.readFile();
  }

  async readFile(file: ProjectMapFile): Promise<Dependencies | undefined> {
    const fileContent = await this.fs.source.readFile(file.path);

    if (file.type === ProjectMapFileType.REACT) {
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

  cleanPath(path: string) {
    console.log('path', path);
    return path.includes('webpack:///')
      ? path.split('webpack:///')[1]
      : path.split('/source/')[1];
  }

  async scanneDuplicateCode() {
    const clones: IClone[] = await jscpd([
      '',
      '',
      `${this.fs.base}/${this.fs.id}/source`,
      '-m',
      'weak',
      '--silent',
    ]);

    await this.fs.duplicateCode.createFile(
      clones.map((clone) => ({
        paths: [
          this.cleanPath(clone.duplicationA.sourceId),
          this.cleanPath(clone.duplicationB.sourceId),
        ],
        codes: [
          {
            path: this.cleanPath(clone.duplicationA.sourceId),
            start: clone.duplicationA.start,
            end: clone.duplicationA.end,
            range: clone.duplicationA.range,
            content: clone.duplicationA.fragment,
          },
          {
            path: this.cleanPath(clone.duplicationB.sourceId),
            start: clone.duplicationB.start,
            end: clone.duplicationB.end,
            range: clone.duplicationB.range,
            content: clone.duplicationB.fragment,
          },
        ],
      })),
    );
  }
}
