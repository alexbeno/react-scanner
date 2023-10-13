/* eslint-disable @typescript-eslint/no-explicit-any */
import { SourceMapConsumer } from 'source-map';
import { Source } from '../@types/source.type';
import { FileSystemsInterface } from './files-system/files-system';
import { detectClones } from 'jscpd';
import { ProjectMapFile } from '../@types/project-map.type';

export interface SourceMapReaderProps {
  rawSourceMap: any;
}

export interface SourceMapReaderInterface {
  readSourceMap(): Promise<Source[]>;
  createProjectSource(): Promise<ProjectMapFile[]>;
}

export class SourceMapReader implements SourceMapReaderInterface {
  private rawSourceMap: any;
  private fs: FileSystemsInterface;

  constructor(props: SourceMapReaderProps, fs: FileSystemsInterface) {
    this.rawSourceMap = props.rawSourceMap;
    this.fs = fs;
  }

  async readSourceMap(): Promise<Source[]> {
    return SourceMapConsumer.with(this.rawSourceMap, null, (consumer) => {
      const sources = consumer.sources.filter(
        (s) =>
          !s.includes('node_modules') &&
          (!s.includes('webpack') || s.includes('webpack:///')),
        // (!s.includes('webpack') && !s.includes('webpack:///')),
      );

      return sources.map((s) => ({
        path: {
          full: s,
          src: s.includes('webpack:///')
            ? s.split('webpack:///')[1]
            : s.split('/src/')[1],
        },
        content: consumer.sourceContentFor(s),
      }));
    });
  }

  async createProjectSource() {
    const sources = await this.readSourceMap();
    const createSourcesAsync = await Promise.all(
      sources.map(
        async (s) =>
          await this.fs.source.createSourceFile({
            path: s.path.src,
            content: s.content,
          }),
      ),
    );

    const files = await this.fs.projectMap.createFile(createSourcesAsync);

    return files;
  }
}
