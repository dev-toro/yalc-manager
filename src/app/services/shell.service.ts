import { Injectable } from '@angular/core';
import { ChildProcessService } from 'ngx-childprocess';
import { Observable, Observer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShellService {

  public constructor(private childProcessService: ChildProcessService) { }

  public run(cmd: string, arg: string[] = [], options: string[] = []): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      console.log('cmd:', cmd);

      const child = this.childProcessService.childProcess.spawn(cmd, arg, {...options, shell: true});

      child.on('error', (err) => {
        console.warn('stderr: <' + err + '>' );
        observer.error(err.toString());
      });

      child.stdout.on('data', this.filterStdoutDataDumpsToTextLines((data) => {
        observer.next(data.toString());
      }));

      child.stderr.on('data', (data) => {
        console.error(`stderr: ${data.toString()}`);
        observer.error(data.toString());
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log('child process complete.');
        }
        else {
          console.log(`child process exited with code ${code}`);
        }
        observer.complete();
      });
    });
  }

  private filterStdoutDataDumpsToTextLines(callback){
    const breakOffFirstLine = /\r?\n/;
    let acc = '';
    return (data) => {
      const splitted = data.toString().split(breakOffFirstLine);
      const inTactLines = splitted.slice(0, splitted.length - 1);
      inTactLines[0] = acc + inTactLines[0];
      acc = splitted[splitted.length - 1];
      inTactLines.forEach((line: string, index: number) => callback(inTactLines[index]));
    };
  }
}
