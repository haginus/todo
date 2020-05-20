import { Injectable, DoCheck } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { List, ListItem} from './list/list'

@Injectable()
export class ListsService {
  lists = new BehaviorSubject<List[]>([]);
  listsLoading = new BehaviorSubject<Boolean>(true);
  items = new BehaviorSubject<ListItem[]>([]);
  itemsLoading = new BehaviorSubject<Boolean>(true);

  getLists():void {
    var open = indexedDB.open("Database", 1);
    var self = this;
    open.onupgradeneeded = function() {
      var db = open.result;
      var store = db.createObjectStore("Lists", {keyPath: "id", autoIncrement: true});
      store.put({ name: "Scopuri în viață"});
      store.put({ name: "Alimente grătar"});
      store = db.createObjectStore("Items", {keyPath: "id", autoIncrement: true});
      var titleIndex = store.createIndex("by_list", "listId");
      var titleIndex = store.createIndex("by_checked", "checked");
      store.put({ primary: "Să ajung la greutatea dorită", secondary: "67 kg", checked: 0, listId: 1});
      store.put({ primary: "Să iau 10 în bac", checked: 0, listId: 1});
      store.put({ primary: "Să intru la facultate", checked: 0, listId: 1});
      store.put({ primary: "Să iau permisul de conducere", secondary: "Categoria B", checked: 1, listId: 1});
      store.put({ primary: "Să citesc „Cel mai iubit dintre pământeni”", checked: 0, listId: 1});
      store.put({ primary: "Bere", secondary: "60 de doze", checked: 1, listId: 2});
      store.put({ primary: "Suc", secondary: "3 sticle Fanta, 2 sticle Cola", checked: 0, listId: 2});
      store.put({ primary: "Carne de porc", secondary: "2kg", checked: 0, listId: 2});
      store.put({ primary: "Carne de pui", secondary: "1kg", checked: 1, listId: 2});
      store.put({ primary: "Mici", secondary: "50 de mici", checked: 0, listId: 2});
      store.put({ primary: "Roșii", checked: 0, listId: 2});
      store.put({ primary: "Castraveți", checked: 1, listId: 2});
      store.put({ primary: "Farfurii", checked: 1, listId: 2});
      store.put({ primary: "Muștar", secondary: "3 borcane", checked: 1, listId: 2});
      store.put({ primary: "Ketchup", secondary: "2 sticle", checked: 0, listId: 2});
      console.log('Bază de date creată!');
      self.getItems();
    };
    
    open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction("Lists", "readwrite");
      var store = tx.objectStore("Lists");
      store = tx.objectStore("Lists");
      var getData = store.getAll()
      getData.onsuccess = function() {
        self.lists.next(getData.result);
        self.listsLoading.next(false);
      };
      tx.oncomplete = function() {
          db.close();
      };
    }
  }

  
  getItems():void {
    var open = indexedDB.open("Database", 1);
    var self = this;
    open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction("Items", "readwrite");
      var store = tx.objectStore("Items");
      store = tx.objectStore("Items");
      var getData = store.getAll()
      getData.onsuccess = function() {
        self.items.next(getData.result);
        self.itemsLoading.next(false);
      };
      tx.oncomplete = function() {
          db.close();
      };
    }
  }

  editItem(item:ListItem):Observable<any> {
    var self = this;
    return new Observable(observer => {
      var DBOpenRequest = window.indexedDB.open("Database", 1);
      DBOpenRequest.onsuccess = function(event) {
        var db = DBOpenRequest.result;
        var transaction = db.transaction("Items", "readwrite");
        var objectStore = transaction.objectStore("Items");
        var objectStoreRequest = objectStore.put(item);
        objectStoreRequest.onsuccess = function(event) {
          observer.next('success');
          self.getItems();
          observer.complete();
        }
        objectStoreRequest.onerror = function(event) {
          observer.next('error');
          observer.complete();
        }
      };
    })
  }

  editList(lists:List[]):Observable<any> {
    var self = this;
    return new Observable(observer => {
      var DBOpenRequest = window.indexedDB.open("Database", 1);
      DBOpenRequest.onsuccess = function(event) {
        var db = DBOpenRequest.result, put = 0;
        var transaction = db.transaction("Lists", "readwrite");
        var objectStore = transaction.objectStore("Lists");
        lists.forEach(list => {
          objectStore.put(list);
          incr();
        });
        function incr() {
          put++;
          if(put >= lists.length) {
            self.getLists();
            observer.next("success");
            observer.complete();
          };
        }
      };
    })
  }

  deleteList(lists:any):Observable<any> {
    var self = this;
    return new Observable(observer => {
      var DBOpenRequest = window.indexedDB.open("Database", 1);
      DBOpenRequest.onsuccess = function(event) {
        var db = DBOpenRequest.result, deleted = 0;
        lists.forEach(listId => {
          var transaction = db.transaction("Lists", "readwrite");
          var objectStore = transaction.objectStore("Lists");
          var objectStoreRequest = objectStore.delete(listId);
          objectStoreRequest.onsuccess = function(event) {
            var transaction = db.transaction(['Items'], 'readwrite');
            var objectStore = transaction.objectStore('Items');
            objectStore.openCursor().onsuccess = function(event) {
              var cursor = event.target.result;
              if(cursor) {
                if(cursor.value.listId == listId) {
                  var request = cursor.delete();
                }
                cursor.continue();
              } else {
                observer.next('success');
                incr();     
              }
            }
          }
          objectStoreRequest.onerror = function(event) {
            observer.next('error');
            incr();
          }
        });
        function incr() {
          deleted++;
          if(deleted >= lists.length) {
            self.getLists();
            observer.complete();
          };
        }
      };
    });
  }
  deleteItem(items:any):Observable<any> {
    var self = this;
    return new Observable(observer => {
      var DBOpenRequest = window.indexedDB.open("Database", 1);
      DBOpenRequest.onsuccess = function(event) {
        var db = DBOpenRequest.result, deleted = 0;
        items.forEach(itemId => {
          var transaction = db.transaction("Items", "readwrite");
          var objectStore = transaction.objectStore("Items");
          var objectStoreRequest = objectStore.delete(itemId);
          observer.next('success');
          incr();
        });
        function incr() {
          deleted++;
          if(deleted >= items.length) {
            self.getItems();
            observer.complete();
          };
        }
      };
    });
  }
  resetDatabase():Observable<any> {
    var self = this;
    return new Observable(observer => {
      var DBDeleteRequest = window.indexedDB.deleteDatabase("Database");
      DBDeleteRequest.onerror = function(event) {
        observer.next("error");  
        observer.complete();      
      };
      DBDeleteRequest.onsuccess = function(event) {
        observer.next("success");
        observer.complete();        
        self.getLists();
      }
    });
  }
  constructor() {
    this.getLists();
    this.getItems();
   }
}

