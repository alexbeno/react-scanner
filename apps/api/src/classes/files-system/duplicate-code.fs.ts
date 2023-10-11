/* eslint-disable @typescript-eslint/no-explicit-any */
import fse from 'fs-extra';
import { FileSystemProps } from './files-system';
import { Duplicate } from '../../@types/duplicate-code.type';

export interface DuplicateCodeFsInterface {
  readFile(): Promise<Duplicate[] | undefined>;
  createFile(duplicates: Duplicate[]): Promise<boolean>;
  addToFile(duplicate: Duplicate): Promise<boolean>;
}

export class DuplicateCodeFs implements DuplicateCodeFsInterface {
  private jsonFile: {
    name: string;
    path: string;
  };

  constructor(props: FileSystemProps) {
    this.jsonFile = {
      name: 'duplicate.map.json',
      path: `${props.base}/${props.id}/duplicate.map.json`,
    };
  }

  async readFile() {
    try {
      const jsonFile = await fse.readFileSync(this.jsonFile.path);
      return JSON.parse(jsonFile as unknown as string) as Duplicate[];
    } catch (err) {
      return undefined;
    }
  }

  async addToFile(duplicateCode: Duplicate) {
    const originalFile = await this.readFile();

    if (!originalFile) {
      await fse.outputFileSync(
        this.jsonFile.path,
        JSON.stringify(
          [
            {
              ...duplicateCode,
            },
          ],
          null,
          2,
        ),
      );
    } else {
      await fse.writeFileSync(
        this.jsonFile.path,
        JSON.stringify([...originalFile, { ...duplicateCode }], null, 2),
      );
    }

    return true;
  }

  async createFile(duplicates: Duplicate[]) {
    await fse.outputFileSync(
      this.jsonFile.path,
      JSON.stringify(duplicates, null, 2),
    );

    return true;
  }
}
