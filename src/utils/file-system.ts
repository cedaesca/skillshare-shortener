// Libraries
import * as path from 'path';

export class FileSystem {
  /**
   * @param { string } file Filename of the view to be returned
   *
   * @return { string }
   */
  static resolveErrorsFolder(file: string): string {
    return path.join(__dirname, '..', 'views', 'errors', `${file}.html`);
  }
}
