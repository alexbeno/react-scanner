/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { Dependencies, Dependency } from 'apps/client/@types/dependencies.type';
import { ProjectMapFile } from 'apps/client/@types/project-map.type';
import { ScanContext } from 'apps/client/context/scan.context';
import { useContext, useEffect, useMemo, useState } from 'react';

export interface getFilesAndDepenciesInterface {
  files: ProjectMapFile | undefined;
  dependencies: Dependencies | undefined;
  deep: getFilesAndDepenciesInterface[];
}
let deepCount = 0;
const DEEP_LIMIT = 500;
export const UseDependencies = () => {
  const { scan, selectedFiles } = useContext(ScanContext);

  const getFilesAndDepencies = (
    file: string,
  ): getFilesAndDepenciesInterface => {
    const files = scan?.projects.find((p) => p.path === file);
    const dependencies = scan?.dependencies.find((d) => d.path === file);

    console.log(deepCount);
    return {
      files: files,
      dependencies: dependencies,
      deep:
        deepCount < DEEP_LIMIT
          ? getDeepDepencies(dependencies?.dependencies || [])
          : [],
    };
  };

  const getDeepDepencies = (
    dependencies: Dependency[],
  ): getFilesAndDepenciesInterface[] => {
    const find = dependencies.map((d) => getFilesAndDepencies(d.path));
    deepCount += 1;
    return find.filter((d) => d.files !== undefined);
  };

  const dependencies = useMemo(
    () => selectedFiles.map((file) => getFilesAndDepencies(file)),
    [selectedFiles],
  );

  return { dependencies: dependencies };
};
