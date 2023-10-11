/* eslint-disable @typescript-eslint/no-explicit-any */
import fse from 'fs-extra';
import {
  ProjectMapFile,
  ProjectMapFileType,
} from '../../@types/project-map.type';
import { FileSystemProps } from './files-system';

export interface ProjectMapFsInterface {
  readFile(): Promise<ProjectMapFile[] | undefined>;
  createFile(p: string[]): Promise<boolean>;
  addToFile(path: string): Promise<boolean>;
}

export class ProjectMapFs implements ProjectMapFsInterface {
  private id: string;
  private base: string;
  private jsonFile: {
    name: string;
    path: string;
  };

  constructor(props: FileSystemProps) {
    this.id = props.id;
    this.base = props.base;
    this.jsonFile = {
      name: 'file.map.json',
      path: `${props.base}/${props.id}/file.map.json`,
    };
  }

  async readFile() {
    try {
      const jsonFile = await fse.readFileSync(this.jsonFile.path);
      return JSON.parse(jsonFile as unknown as string) as ProjectMapFile[];
    } catch (err) {
      return undefined;
    }
  }

  private getTypeFromExtension(name: string) {
    const getExtension = name.split('.');
    const extension = getExtension.at(-1);

    if (extension === 'jsx' || extension === 'tsx' || extension === 'js') {
      return ProjectMapFileType.REACT;
    }

    if (extension === 'js' || extension === 'ts') {
      return ProjectMapFileType.SCRIPT;
    }

    if (extension === 'css' || extension === 'scss' || extension === 'less') {
      return ProjectMapFileType.CSS;
    }

    return ProjectMapFileType.OTHER;
  }

  private getFileNameFromPath(path: string) {
    if (path) {
      const getFileName = path.split('/');

      return getFileName.at(-1);
    }

    return '';
  }

  private getFolderPathFromPath(path: string) {
    if (path) {
      const getFolderPath = [...path.split('/')];
      getFolderPath.pop();
      return getFolderPath.join('/');
    }

    return '';
  }

  async addToFile(path: string) {
    const originalFile = await this.readFile();
    const name = this.getFileNameFromPath(path);
    const type = this.getTypeFromExtension(name);
    const folder = this.getFolderPathFromPath(path);

    if (!originalFile) {
      await fse.outputFileSync(
        this.jsonFile.path,
        JSON.stringify([
          {
            path,
            type: type,
            folder: folder,
            fileName: name,
          },
        ]),
      );
    } else {
      await fse.writeFileSync(
        this.jsonFile.path,
        JSON.stringify(
          [
            ...originalFile,
            {
              path,
              type: type,
              folder: folder,
              fileName: name,
            },
          ],
          null,
          2,
        ),
      );
    }

    return true;
  }

  async createFile(path: string[]) {
    await fse.outputFileSync(
      this.jsonFile.path,
      JSON.stringify(
        path.map((p) => {
          const name = this.getFileNameFromPath(p);
          const folder = this.getFolderPathFromPath(p);
          const type = this.getTypeFromExtension(name);
          return {
            path: p,
            type: type,
            fileName: name,
            folder: folder,
          };
        }),
        null,
        2,
      ),
    );

    return true;
  }
}
