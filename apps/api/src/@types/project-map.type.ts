export enum ProjectMapFileType {
  REACT = 'react',
  SCRIPT = 'script',
  CSS = 'css',
  OTHER = 'other',
}

export interface ProjectMapFile {
  path: string;
  folder: string;
  type: ProjectMapFileType;
  fileName: string;
}
