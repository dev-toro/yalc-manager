import { Injectable } from '@angular/core';
import { IPackageInstallations } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fs: any;
  public constructor() {
    // or this.fs = <any>window.fs
    this.fs = (window as any).fs;
  }
  // read file synchronous
  public getFile(path: string): IPackageInstallations {
    // return synchronous filestream
    return JSON.parse(this.fs.readFileSync(path));
  }
}
