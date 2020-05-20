import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import {MediaMatcher} from '@angular/cdk/layout';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import {ListsService} from './lists.service';
import { ListComponent, EditItemDialog } from './list/list.component';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { ListsManageDialog, DeleteListDialog, RenameListDialog, ResetDatabaseDialog } from './dialogs/dialogs';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    EditItemDialog,
    AboutDialogComponent,
    SettingsComponent,
    ListsManageDialog,
    DeleteListDialog,
    RenameListDialog,
    ResetDatabaseDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    MatDialogModule
  ],
  entryComponents: [EditItemDialog, AboutDialogComponent, ListsManageDialog, DeleteListDialog, RenameListDialog, ResetDatabaseDialog],
  providers: [MediaMatcher, ListsService, MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
