import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';

import { MatButtonModule } from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';

const modules:any = [MatSidenavModule,
  MatToolbarModule,
  MatIconModule, 
  MatButtonModule,
  MatListModule,
  MatCheckboxModule,
  MatCardModule,
  MatSnackBarModule,
  MatInputModule,
  MatMenuModule,
  MatExpansionModule,
  MatSelectModule,
  MatTooltipModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }