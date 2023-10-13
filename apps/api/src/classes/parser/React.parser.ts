import { DependenciesType, Dependency } from '../../@types/dependencies.type';
import { Parser } from './parser';

export interface ReactParserInterface {
  getDependencies(content: string, path: string): Promise<Dependency[]>;
}

export class ReactParser extends Parser implements ReactParserInterface {
  ignoreDepencies = ['react'];
  private getDependenciesArray(content) {
    const splited = content.split('\n');
    const importRegex =
      /import\s+(?:{([^}]+)})?\s*([^,]+)?\s+from\s+['"](.+?)['"]/g;
    const imports = [];
    let match;

    splited.forEach((code) => {
      while ((match = importRegex.exec(code)) !== null) {
        const namedImports = match[1];
        const defaultImport = match[2];
        const importPath = match[3];

        if (namedImports) {
          const importNames = namedImports
            .split(',')
            .map((name) => name.trim())
            .filter(Boolean);

          importNames.forEach((name) => {
            imports.push({
              name,
              path: importPath.replace(/\.\.\//g, '').replace(/^\.\//, ''),
            });
          });
        } else if (defaultImport) {
          imports.push({
            name: defaultImport.trim(),
            path: importPath.replace(/\.\.\//g, '').replace(/^\.\//, ''),
          });
        }
      }
    });

    return imports.filter((e) => e !== undefined);
  }

  private async fileExist(filePath: string, parentPath: string) {
    if (this.ignoreDepencies.find((ignored) => ignored === filePath)) {
      return undefined;
    }

    const componentName = filePath.split('/').at(-1);
    const absolutePath = filePath;
    const relativePath = `${parentPath}/${filePath}`;
    const extensions = [
      `/index.jsx`,
      `/index.js`,
      `/index.tsx`,
      `/index.ts`,
      `/${componentName}.jsx`,
      `/${componentName}.js`,
      `/${componentName}.tsx`,
      `/${componentName}.ts`,
      '.jsx',
      '.js',
      '.tsx',
      '.ts',
      '.json',
      '.css',
    ];

    const existsAbsolute = await Promise.all(
      extensions.map(
        async (e) => await this.fs.source.fileExist(`${absolutePath}${e}`),
      ),
    );

    const findExistingAbsolutePath = existsAbsolute.find(
      (exist) => exist !== undefined,
    );
    if (findExistingAbsolutePath) {
      return findExistingAbsolutePath;
    }

    const existsRelative = await Promise.all(
      extensions.map(
        async (e) => await this.fs.source.fileExist(`${relativePath}${e}`),
      ),
    );

    const findExistingRelativePath = existsRelative.find(
      (exist) => exist !== undefined,
    );
    if (findExistingRelativePath) {
      return findExistingRelativePath;
    }

    return undefined;
  }

  async getDependencies(content, path: string) {
    const dependenciesArray = this.getDependenciesArray(content);
    const dependenciesMap = await Promise.all(
      dependenciesArray.map(async (d) => {
        const exist = await this.fileExist(d.path, path);
        if (exist) {
          return {
            path: exist,
            name: d.name,
            type: DependenciesType.INTERNAL,
          };
        }

        return {
          path: d.path,
          name: d.name,
          type: DependenciesType.EXTERNAL,
        };
      }),
    );

    return dependenciesMap;
  }
}

// import { FC, useState } from 'react'
// import { HomePanelTab1Types } from './Tab1.type'
// import Toggle from '../../../../components/Form/Toggle'
// import { EyeSlashIcon, MagnifyingGlassIcon, PencilIcon, CheckIcon } from '@heroicons/react/20/solid'
// import TextField from '../../../../components/Form/TextField'
// import { Controller, useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import Submit from '../../../../components/Submit'
// import Tabs, { TabsTypes } from '../../components/Tabs'

// - import { FC, useState } from 'react' should be [{name: 'FC', path: 'react'}, {name: 'useState', path: 'react'} ]
// - import Toggle from '../../../../components/Form/Toggle' should be [{name: 'Toggle', path: '../../../../components/Form/Toggle'}]
// - import { yupResolver } from '@hookform/resolvers/yup' should be [{name: 'yupResolver', path: '@hookform/resolvers/yup'}]
// - import Tabs, { TabsTypes } from '../../components/Tabs' should be [{name: 'Tabs', path: '../../components/Tabs'}, {name: 'TabsTypes', path: '../../components/Tabs'}]
