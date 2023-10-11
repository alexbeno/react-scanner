import { FileSystemsInterface } from '../files-system/files-system';

export interface ParserProps {
  fs: FileSystemsInterface;
}

export class Parser {
  fs: FileSystemsInterface;

  constructor(props: ParserProps) {
    this.fs = props.fs;
  }
}
