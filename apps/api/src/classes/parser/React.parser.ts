import { DependenciesType, Dependency } from '../../@types/dependencies.type';
import { Parser } from './parser';

export interface ReactParserInterface {
  getDependencies(content: string, path: string): Promise<Dependency[]>;
}

export class ReactParser extends Parser implements ReactParserInterface {
  ignoreDepencies = ['react'];
  private getDependenciesArray(content) {
    const importRegex =
      /import\s+(?:{([^}]+)}|([^{}]+))\s+from\s+['"](.+?)['"]/g;
    const imports: { name: string; path: string }[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
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
