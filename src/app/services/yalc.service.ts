import { Injectable } from '@angular/core';
import { ShellService } from './shell.service';
import {flatMap, toArray} from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { FileService } from './file.service';
import { IPackageInstallations } from '../models';

@Injectable({
  providedIn: 'root'
})
export class YalcService {

  public directory: string;

  public constructor(
    private readonly shellService: ShellService,
    private readonly fileService: FileService
  ) {}

  public checkVersion(): void {
    this.shellService.run('yalc --version').subscribe((version: string) => console.log(version));
  }

  private checkDir(): Observable<string> {
   return this.shellService.run('yalc dir');
  }

  public listMainDir(): Observable<string[]> {
    return this.checkDir().pipe(
      flatMap((directory: string) => {
        return this.listDir(directory);
      })
    );
  }

  public listDir(directory: string): Observable<string[]> {
    return new Observable(observer => {
      this.shellService
        .run(`ls ${directory}`)
        .pipe(toArray())
        .subscribe(((value: string[]) => {
          observer.next(value);
          observer.complete();
        }));
    });
  }

  public listInstallations(): Observable<IPackageInstallations> {
    return this.checkDir().pipe(
      flatMap((directory: string) => {
        return new Observable<IPackageInstallations>((observer: Observer<IPackageInstallations>) => {
          const installationsPath = `${directory}/installations.json`;
          const installations =  this.fileService.getFile(installationsPath);
          observer.next(installations);
          observer.complete();
        });
      })
    );
  }

  // private separateArrayByTitle(title: string, stream: string[]): packageListResult {
  //   const packageIndexes: Array<indexPackageType> = [];
  //   stream.forEach((item: string, index: number) => {
  //     if (item.startsWith(title)) {
  //       const name = item
  //         .replace(title, '')
  //         .replace(':', '')
  //         .trim();
  //       const start = index + 1;
  //       const result: indexPackageType = {name, start};
  //       if (packageIndexes.length > 0){
  //         packageIndexes[packageIndexes.length - 1].end = index - 1;
  //       }
  //       packageIndexes.push(result);
  //     }
  //   });
  //   packageIndexes[packageIndexes.length - 1].end = stream.length;
  //   const packages: packageListResult = [];
  //   packageIndexes.forEach((packageIndex: indexPackageType) => {
  //     const name = packageIndex.name;
  //     const installations = [...stream]
  //       .splice(packageIndex.start , packageIndex.end)
  //       .map(((value: string) => value.trim()));
  //     packages.push({
  //       package: name,
  //       installations
  //     });
  //   });
  //   return packages;
  // }

}
