import { AppGroups } from './app.type';
import { Dependencies } from './dependencies.type';
import { Duplicate } from './duplicate-code.type';
import { ProjectMapFile } from './project-map.type';

export interface Scanne {
  dependencies: Dependencies[];
  duplicateCode: Duplicate[];
  projects: ProjectMapFile[];
  // groups: AppGroups[];
}
