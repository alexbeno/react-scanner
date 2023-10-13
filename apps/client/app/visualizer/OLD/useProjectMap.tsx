/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { ProjectMapFile } from 'apps/client/@types/project-map.type';
import { ScanContext } from 'apps/client/context/scan.context';
import { useContext, useMemo } from 'react';
import { Edge, Node } from 'reactflow';

export interface ProjectMap extends ProjectMapFile {
  dependenciesOf: string[];
  dependentOf: string[];
}

export interface Group {
  path: string;
  name: string;
  files: ProjectMap[];
  dependenciesOf: string[];
  dependentOf: string[];
}

export interface App extends Group {
  name: string;
  apps: App[];
}

export const UseProjectMap = () => {
  const { scan } = useContext(ScanContext);

  const haveDependencies = (file: ProjectMapFile) => {
    const findDependencies = (scan?.dependencies || []).filter((d) =>
      d.dependencies.find((d2) => d2.path === file.path),
    );

    if (findDependencies) {
      return findDependencies.map((d) => d.path);
    }

    return [];
  };

  const isDependent = (file: ProjectMapFile) => {
    const findDependencies = (scan?.dependencies || []).filter(
      (d) => d.path === file.path,
    );

    if (findDependencies) {
      return findDependencies.flatMap((d) =>
        d.dependencies
          .filter((d) => d.type === 'internal')
          .map((d2) => d2.path),
      );
    }

    return [];
  };

  const groupProjectFile = (
    groups: Group[],
    file: ProjectMap,
  ): Group | undefined => {
    const getGroupName =
      file.path.split('/')?.at(-2) || file.path.split('.').at(0);
    const findGroup = groups.find((group) => group.name === getGroupName);

    if (getGroupName) {
      if (!findGroup) {
        groups.push({
          name: getGroupName,
          path: file.path,
          files: [file],
          dependentOf: file.dependentOf.filter(
            (fd) => !fd.includes(`${getGroupName}/`),
          ),
          dependenciesOf: file.dependenciesOf.filter(
            (fd) => !fd.includes(`${getGroupName}/`),
          ),
        });
      }

      if (findGroup) {
        findGroup.files.push(file);
        findGroup.dependenciesOf = [
          ...findGroup?.dependenciesOf,
          ...file.dependenciesOf.filter((fd) => {
            return (
              !fd.includes(`${findGroup.name}/`) &&
              !findGroup.dependenciesOf.find((d) => d === fd)
            );
          }),
          ...file.dependentOf.filter((fd) => {
            return (
              !fd.includes(`${findGroup.name}/`) &&
              !findGroup.dependentOf.find((d) => d === fd)
            );
          }),
        ];
      }
    }

    return findGroup;
  };

  const project: ProjectMap[] = useMemo(
    () =>
      (scan?.projects || []).flatMap((file) => {
        return {
          ...file,
          dependenciesOf: haveDependencies(file),
          dependentOf: isDependent(file),
        };
      }),
    [scan],
  );

  const Groups: Group[] = useMemo(() => {
    const groups: Group[] = [];

    project.forEach((node, key) => groupProjectFile(groups, node));

    return groups;
  }, [project]);

  const sortedGroup: Group[] = useMemo(() => {
    const sortedByNumberOfDependent = [...Groups].sort((a, b) => {
      return b.dependenciesOf.length - a.dependenciesOf.length;
    });

    return sortedByNumberOfDependent;
  }, [Groups]);

  const createAppGroupsDependencies = (name: string): App[] => {
    const findGroup = sortedGroup.find((group) =>
      group.files.find((f) => f.path === name),
    );
    if (findGroup) {
      return [
        {
          ...findGroup,
          apps: findGroup.dependentOf.flatMap((d) =>
            createAppGroupsDependencies(d),
          ),
        },
      ];
    }

    return [];
  };

  const createApp = (group: Group, apps: App[]) => {
    const findApp = apps.find((app) => app.name === group.name);

    if (group.dependentOf.length > 0) {
      const dependencies = group.dependentOf.map((d) =>
        createAppGroupsDependencies(d),
      );

      console.log('dependencies', dependencies);

      dependencies.flat().forEach((d) => {
        apps.push(d);
      });
    } else {
      if (findApp) {
        findApp.apps.push({
          ...group,
          apps: [],
        });
      } else {
        apps.push({
          ...group,
          apps: [],
        });
      }
    }
  };

  const App: App[] = useMemo(() => {
    const apps: App[] = [];

    sortedGroup.forEach((group, key) => createApp(group, apps));

    return apps.sort((a, b) => {
      return b.apps.length - a.apps.length;
    });
  }, [sortedGroup]);

  console.log('project', project);
  console.log('groupProject', Groups);
  console.log('sortedMap', sortedGroup);
  console.log('App', App);

  return { project: project };
};
