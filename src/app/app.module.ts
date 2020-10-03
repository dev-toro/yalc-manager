import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxChildProcessModule} from 'ngx-childprocess';
import { TreeTableComponent } from './components/tree-table/tree-table.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeTableComponent
  ],
  imports: [
    BrowserModule,
    NgxChildProcessModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
