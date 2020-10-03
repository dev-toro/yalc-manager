import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {YalcService} from './services/yalc.service';
import {TreeNode} from 'primeng/api';
import {IPackageInstallations} from './models';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public data: TreeNode[] = [];

  public constructor(private yalcService: YalcService,
                     private cd: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.yalcService.listInstallations()
      .pipe(
        map((installations: IPackageInstallations) => {
          const nodes: TreeNode[] = [];
          const keys = Object.keys(installations);
          keys.forEach((key: string) => {
            const children: TreeNode[] = installations[key].map(value => {
              return {
                data: {name: value},
                selectable: true,
              };
            });
            nodes.push({
              data: {
                name: key,
              },
              children,
            });
          });
          return nodes;
        })
      )
      .subscribe((value: TreeNode[]) => {
        console.log('list installations', value);
        this.data = value;
        this.cd.detectChanges();
        console.log('this.data', this.data)
    });
  }

  public ngOnDestroy(): void {}

  public execute(): void {
   this.yalcService.checkVersion();
   this.yalcService.listInstallations().subscribe((value => console.log(value)));

  }

}
