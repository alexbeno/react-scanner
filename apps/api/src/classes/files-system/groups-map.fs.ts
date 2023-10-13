/* eslint-disable @typescript-eslint/no-explicit-any */
import fse from 'fs-extra';
import { FileSystemProps } from './files-system';
import { AppGroups } from '../../@types/app.type';

export interface groupsMapFsInterface {
  readFile(): Promise<AppGroups[] | undefined>;
  createFile(groups: AppGroups[]): Promise<boolean>;
  addToFile(group: AppGroups): Promise<boolean>;
}

export class groupsMapFs implements groupsMapFsInterface {
  private jsonFile: {
    name: string;
    path: string;
  };

  constructor(props: FileSystemProps) {
    this.jsonFile = {
      name: 'groups.map.json',
      path: `${props.base}/${props.id}/groups.map.json`,
    };
  }

  async readFile() {
    try {
      const jsonFile = await fse.readFileSync(this.jsonFile.path);
      return JSON.parse(jsonFile as unknown as string) as AppGroups[];
    } catch (err) {
      return undefined;
    }
  }

  async addToFile(group: AppGroups) {
    const originalFile = await this.readFile();

    if (!originalFile) {
      await fse.outputFileSync(
        this.jsonFile.path,
        JSON.stringify(
          [
            {
              ...group,
            },
          ],
          null,
          2,
        ),
      );
    } else {
      await fse.writeFileSync(
        this.jsonFile.path,
        JSON.stringify([...originalFile, { ...group }], null, 2),
      );
    }

    return true;
  }

  async createFile(groups: AppGroups[]) {
    await fse.outputFileSync(
      this.jsonFile.path,
      JSON.stringify(groups, null, 2),
    );

    return true;
  }
}
