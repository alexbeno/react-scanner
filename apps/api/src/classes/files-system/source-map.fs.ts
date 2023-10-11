/* eslint-disable @typescript-eslint/no-explicit-any */
import fse from 'fs-extra';
import { FileSystemProps } from './files-system';

export interface createFileP {
  path: string;
  content: any;
}

export interface SourceMapFsInterface {
  createSourceFile(p: createFileP): Promise<string | undefined>;
  readFile(p: string): Promise<string | undefined>;
  fileExist(p: string): Promise<string | undefined>;
}

export class SourceMapFs implements SourceMapFsInterface {
  private id: string;
  private base: string;
  private sourceFolder = 'source';

  constructor(props: FileSystemProps) {
    this.id = props.id;
    this.base = props.base;
  }

  async createSourceFile(p: createFileP) {
    try {
      await fse.outputFileSync(
        `${this.base}/${this.id}/${this.sourceFolder}/${p.path}`,
        p.content,
      );
      return p.path;
    } catch {
      return undefined;
    }
  }

  async readFile(path: string) {
    try {
      const content = await fse.readFileSync(
        `${this.base}/${this.id}/${this.sourceFolder}/${path}`,
        'utf-8',
      );
      return content;
    } catch {
      return undefined;
    }
  }

  async fileExist(path: string) {
    try {
      const content = await fse.existsSync(
        `${this.base}/${this.id}/${this.sourceFolder}/${path}`,
      );
      return content ? `${path}` : undefined;
    } catch {
      return undefined;
    }
  }
}
