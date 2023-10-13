import { Injectable } from '@nestjs/common';
import axios from 'axios';
import path from 'path';
import { FileSystem } from '../classes/files-system/files-system';
import { SourceMapReader } from '../classes/source-map-reader';
import { DependenciesScanner } from '../classes/dependencies-scanner';
import { detectClones, jscpd } from 'jscpd';
import { IClone } from '@jscpd/core';
import { DuplicateCodeScanner } from '../classes/duplicate-code-scanner';
import { AppScanner } from '../classes/app-scanner/app-scanner';
@Injectable()
export class AppService {
  async getData() {
    try {
      const rawSourceMap = await axios.get(
        // 'http://127.0.0.1:3000/static/js/bundle.js.map',
        'http://127.0.0.1:3000/main.js.map',
        // 'http://127.0.0.1:3000/static/js/main.chunk.js.map',
      );

      // console.log('raw', rawSourceMap);

      const date = new Date().getTime();

      const fileSystem = new FileSystem({
        id: `${date}`,
        base: path.resolve(__dirname, `./tmp/`),
      });

      const sources = new SourceMapReader(
        { rawSourceMap: rawSourceMap.data },
        fileSystem,
      );
      const projects = await sources.createProjectSource();

      const dependenciesScanner = new DependenciesScanner({ fs: fileSystem });
      const dependencies = await dependenciesScanner.createDependenciesMap();

      // const duplicateCodeScanner = new DuplicateCodeScanner({ fs: fileSystem });
      // const duplicateCode = await duplicateCodeScanner.scanneDuplicateCode();

      // const app = new AppScanner({
      //   fs: fileSystem,
      //   dependencies,
      //   files: projects,
      // });
      // const groups = await app.createApp();
      // console.log('grouos', groups);
      // return { dependencies, duplicateCode, projects, groups: groups };
      console.log('ennnnnd');
      return { dependencies, projects };
    } catch (err) {
      console.log('err', err);
    }
  }
}
