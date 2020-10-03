import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss'],
})
export class TreeTableComponent implements OnInit {

  public files: TreeNode[] = [];

  @Input()
  public set data(data: TreeNode[]) {
    console.log('here new data recived', data);
    this.files = data;
  }

  public cols: any[];
  public selectedNode: TreeNode;

  public constructor() {
    this.cols = [
      { field: 'name', header: 'Name' },
    ];
  }

  public ngOnInit(): void {
  }

}
