/* eslint-disable @typescript-eslint/no-explicit-any */
import fse from 'fs-extra';
import { FileSystemProps } from './files-system';
import { Dependencies } from '../../@types/dependencies.type';

export interface DependenciesMapFsInterface {
  readFile(): Promise<Dependencies[] | undefined>;
  createFile(dependencies: Dependencies[]): Promise<boolean>;
  addToFile(dependency: Dependencies): Promise<boolean>;
}

export class DependenciesMapFs implements DependenciesMapFsInterface {
  private jsonFile: {
    name: string;
    path: string;
  };

  constructor(props: FileSystemProps) {
    this.jsonFile = {
      name: 'dependencies.map.json',
      path: `${props.base}/${props.id}/dependencies.map.json`,
    };
  }

  async readFile() {
    try {
      const jsonFile = await fse.readFileSync(this.jsonFile.path);
      return JSON.parse(jsonFile as unknown as string) as Dependencies[];
    } catch (err) {
      return undefined;
    }
  }

  async addToFile(dependency: Dependencies) {
    const originalFile = await this.readFile();

    if (!originalFile) {
      await fse.outputFileSync(
        this.jsonFile.path,
        JSON.stringify(
          [
            {
              ...dependency,
            },
          ],
          null,
          2,
        ),
      );
    } else {
      await fse.writeFileSync(
        this.jsonFile.path,
        JSON.stringify([...originalFile, { ...dependency }], null, 2),
      );
    }

    return true;
  }

  async createFile(dependencies: Dependencies[]) {
    await fse.outputFileSync(
      this.jsonFile.path,
      JSON.stringify(dependencies, null, 2),
    );

    return true;
  }
}
