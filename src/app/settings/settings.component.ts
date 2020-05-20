import { Component, OnInit } from '@angular/core';
import { ResetDatabaseDialog } from '../dialogs/dialogs';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openResetDatabaseDialog() {
    this.dialog.open(ResetDatabaseDialog);
  }
  ngOnInit() {
  }

}
