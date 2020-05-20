import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ListsService} from './lists.service';
import { List, ListItem } from './list/list'
import { MatSnackBar } from '@angular/material';
import { RouterTransition } from './app.animations';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { ListsManageDialog } from './dialogs/dialogs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [RouterTransition]
})
export class AppComponent implements OnInit {
  title = 'Liste de sarcini';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private listsService: ListsService, public snackBar: MatSnackBar, public dialog: MatDialog, public router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  menuOpened:boolean;
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  lists:List[];
  listsLoaded = new Promise(resolve => {
    this.listsService.listsLoading.subscribe(isLoading => {
      if(isLoading == false) resolve();
    });
  });

  ngOnInit(): void {
    this.listsService.lists.subscribe(val => {
      this.lists = val;
    });
    this.listsLoaded.then(() => {
      var id;
      if(this.lists) {
        if(this.lists[0]) {
          id = this.lists[0].id;
        }
      }
      if(id != undefined) if(this.router.url == '/') this.router.navigate(['/list', id]);
    })
  }

  openAboutDialog(): void {
    this.dialog.open(AboutDialogComponent);
  }

  openListManageDialog(autoFocus?:boolean):void {
    if(autoFocus == undefined) autoFocus = false;
    this.dialog.open(ListsManageDialog, {
      autoFocus: autoFocus,
      width: '320px',
      disableClose: true
    });
  }

  getState(outlet) {
    return outlet.activatedRouteData.path;
  }
}