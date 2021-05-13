import { URL } from 'url';

export class General {
  static isValidURL(url: string): boolean {
    try {
      new URL(url);

      return true;
    } catch (err) {
      return false;
    }
  }
}
