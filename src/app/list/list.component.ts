import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { List, ListItem } from './list'
import {ListsService} from '../lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Am } from '../app.animations';
import { DeleteListDialog, RenameListDialog } from '../dialogs/dialogs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [Am]
})
export class ListComponent implements OnInit, OnDestroy {

  constructor(public listsService: ListsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  id: number;
  private idSub: any; 
  private itemsSub:any;
  items:ListItem[] = [];
  listItems: ListItem[];
  filteredItems: FilteredList = {
    checked: [],
    unchecked: []
  };
  listsSub: any;
  lists:any;
  currentList: List;
  listsLoaded = new Promise(resolve => {
    this.listsService.listsLoading.subscribe(isLoading => {
      if(isLoading == false) resolve();
    });
  });
  noListAlert:boolean = false;

  ngOnInit() {
    this.idSub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.filteredItems = {
        checked: [],
        unchecked: []
      };
      this.filterItems();
    });

    this.listsLoaded.then(() => {
      this.listsSub = this.listsService.lists.subscribe(lists => {
        this.lists = lists;
        this.currentList = lists.filter(list => list.id == this.id)[0];
        if(this.currentList == undefined) {
          if(!this.noListAlert) {
            let snackBarRef = this.snackBar.open('Această listă nu există.', null, {
              duration: 3000,
            });
          }
          this.router.navigate(['/list', lists[0].id]);
        }
        this.itemsSub = this.listsService.items.subscribe(items => {
          this.items = items;
          this.filterItems();
        });
      });
    })
  }

  filterItems():void {
    if(this.lists) this.currentList = this.lists.filter(list => list.id == this.id)[0];
    this.listItems = this.items.filter(item => item.listId == this.id);
    var listItems = this.listItems.map(x => Object.assign({}, x));
    this.filteredItems.unchecked = [] 
    this.filteredItems.unchecked = listItems.filter(item => item.checked == 0);
    this.filteredItems.checked = listItems.filter(item => item.checked == 1);
  }

  editItem(item:ListItem):void {
    item.checked = item.checked ? 1 : 0;
    var msg = 'Sarcină salvată.';
    this.listsService.editItem(item).subscribe(val => {
      this.snackBar.open(msg, null, {
        duration: 5000,
      });
    });
  }

  setCheckedState(item:ListItem, noToast?:boolean):void {
    var msg = item.checked ? 'Sarcină marcată drept completă.' : 'Sarcină marcată drept necompletă.';
    item.checked = item.checked ? 1 : 0;
    this.listsService.editItem(item).subscribe(val => {
      if(!noToast) {
        this.snackBar.open(msg, 'ANULEAZĂ', {
          duration: 5000
        }).onAction().subscribe(val => {
          item.checked = item.checked == 1 ? 0 : 1;
          this.setCheckedState(item, true);
        });
      }
    });
  }

  openEditItemDialog(item?: any): void {
    var data:any = {};
    if(item != undefined) data = { item: {...item } };
    else data = {isNew: true, item: {listId: this.id, checked: 0}};
    let dialogRef = this.dialog.open(EditItemDialog, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(typeof result == "object") {
        this.editItem(result.item);
      }
    });
  }

  ngOnDestroy(): void {
    this.listsSub.unsubscribe();
    this.itemsSub.unsubscribe();
    this.filteredItems = {
      checked: [],
      unchecked: []
    };
  }

  openDeleteListDialog(): void {
    this.noListAlert = true;
    let dialogRef = this.dialog.open(DeleteListDialog, {
      width: '400px',
      data: {listId: this.id, listName: this.currentList.name}
    });
    dialogRef.afterClosed().subscribe(val => {
      if(val == undefined) this.noListAlert = false;
    })
  }

  openRenameListDialog(): void {
    let dialogRef = this.dialog.open(RenameListDialog, {
      data: {list: {...this.currentList}}
    });
  }

  deleteCheckedItems(): void {
    var toDelete = this.filteredItems.checked.map(item => item.id);
    this.listsService.deleteItem(toDelete).subscribe(val => {
      this.snackBar.open("Sarcinile complete au fost șterse.", null, {
        duration: 5000
      });
    });
  }


  trackItem(index, item) {
    return item ? item.id : undefined;
  }

}

interface FilteredList {
  unchecked: ListItem[],
  checked: ListItem[]
}



@Component({
    selector: 'edit-item-dialog',
    templateUrl: 'edit-item.dialog.html',
  })
  export class EditItemDialog {
  
    constructor(
      public dialogRef: MatDialogRef<EditItemDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any, private listsService: ListsService, private snackBar: MatSnackBar) { }
    
    saveItem(_data:any) {
      this.dialogRef.close(_data);
    }
    deleteItem(itemId:any):void {
      this.listsService.deleteItem([itemId]).subscribe(val => {
        this.snackBar.open("Sarcină ștearsă.", null, {
          duration: 5000
        });
      });
      this.dialogRef.close();
    }
  }
  

