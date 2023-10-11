import { Injectable } from '@nestjs/common';
import axios from 'axios';
import path from 'path';
import { FileSystem } from '../classes/files-system/files-system';
import { SourceMapReader } from '../classes/source-map-reader';
import { DependenciesScanner } from '../classes/dependencies-scanner';
import { detectClones, jscpd } from 'jscpd';
import { IClone } from '@jscpd/core';
import { DuplicateCodeScanner } from '../classes/duplicate-code-scanner';
@Injectable()
export class AppService {
  async getData() {
    try {
      const rawSourceMap = await axios.get(
        'http://127.0.0.1:3000/static/js/bundle.js.map',
        // 'http://127.0.0.1:3000/main.js.map',
        // 'http://127.0.0.1:3000/static/js/main.chunk.js.map',
      );

      const date = new Date().getTime();

      const fileSystem = new FileSystem({
        id: `${date}`,
        base: path.resolve(__dirname, `./tmp/`),
      });

      const sources = new SourceMapReader(
        { rawSourceMap: rawSourceMap.data },
        fileSystem,
      );
      await sources.createProjectSource();

      const dependenciesScanner = new DependenciesScanner({ fs: fileSystem });
      await dependenciesScanner.createDependenciesMap();

      const duplicateCodeScanner = new DuplicateCodeScanner({ fs: fileSystem });
      await duplicateCodeScanner.scanneDuplicateCode();
    } catch (err) {
      console.log('err', err);
    }

    return { message: 'Hello API' };
  }
}
