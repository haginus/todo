import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ListsService } from '../lists.service';
import { List } from '../list/list';
import { Am } from '../app.animations';

@Component({
  selector: 'lists-manage-dialog',
  templateUrl: './lists-manage-dialog.html',
  animations: [Am]
})
export class ListsManageDialog implements OnInit, OnDestroy {
    constructor(public dialogRef: MatDialogRef<ListsManageDialog>, public listsService: ListsService, @Inject(MAT_DIALOG_DATA) public data: any) { }
    lists: any;
    oldLists: List[];
    newList:any = {changed: true, isNew: true};
    changed:boolean = false;
    deleted:number = 0;
    ngOnInit(): void {
        this.listsService.lists.subscribe(val => {
            this.lists = val.map(x => Object.assign({}, x));
            this.oldLists = val.map(x => Object.assign({}, x));
        });
    }
    ngOnDestroy(): void {
        
    }

    deleteList(index) {
        if(!this.lists[index].isNew) {
            this.lists[index].deleted = true;
            this.deleted++;
        } else this.lists.splice(index, 1);;
    }

    canDelete() {
        return this.deleted < (this.lists.length - 1);
    }

    addToLists(list:any) {
        var list:any = list;
        if(!list) return;
        if(!list.name || list.name.length == 0) return;
        delete list.onEdit;
        this.lists.push(list);
        this.newList = {changed: true, onEdit: true, isNew: true};
        this.changed = true;
    }

    cancel() {
        this.dialogRef.close(this.oldLists);
    }

    undoChanges():void {
        this.lists = this.oldLists.map(x => Object.assign({}, x));
        this.changed = false;
        this.deleted = 0;
    }

    save():void {
        if(this.newList.name && this.newList.name.length > 0) this.addToLists(this.newList);
        var toUpdate = this.lists.filter(list => list.changed && list.name.length > 0).map(val => {
            var ret = {name: val.name, id: val.id};
            if(ret.id == undefined) delete ret.id;
            return ret;
        });
        var toDelete = this.lists.filter(list => list.deleted).map(val => {
            return val.id;
        });
        if(toUpdate.length > 0) this.listsService.editList(toUpdate).subscribe();
        if(toDelete.length > 0) this.listsService.deleteList(toDelete).subscribe();
        this.dialogRef.close();
    }

    trackList(index, list) {
        return list ? list.id : undefined;
    }
}


@Component({
    selector: 'delete-list-dialog',
    templateUrl: './delete-list-dialog.html'
})
export class DeleteListDialog {
    constructor(public dialogRef: MatDialogRef<ListsManageDialog>, public listsService: ListsService, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) { }
    cancel():void {
        this.dialogRef.close();
    }
    confirm():void {
        this.listsService.deleteList([this.data.listId]).subscribe(res => {
            this.snackBar.open("Listă ștearsă.", null, {
                duration: 5000,
            });
        });
        this.dialogRef.close();
    }
}

@Component({
    selector: 'rename-list-dialog',
    templateUrl: './rename-list-dialog.html'
})
export class RenameListDialog {
    constructor(public dialogRef: MatDialogRef<ListsManageDialog>, public listsService: ListsService, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) { }
    cancel():void {
        this.dialogRef.close();
    }
    confirm():void {
        this.listsService.editList([this.data.list]).subscribe(res => {
            this.snackBar.open("Listă redenumită.", null, {
                duration: 5000,
            });
        }); 
        this.dialogRef.close();
    }
}

@Component({
    selector: 'reset-database-dialog',
    templateUrl: './reset-database-dialog.html'
})
export class ResetDatabaseDialog {
    constructor(public dialogRef: MatDialogRef<ListsManageDialog>, public listsService: ListsService, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) { }

    confirm():void {
        this.listsService.resetDatabase().subscribe(res => {
            this.snackBar.open("Baza de date a fost resetată.", null, {
                duration: 5000,
            });
        }); 
        this.dialogRef.close();
    }
}