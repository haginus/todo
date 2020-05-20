export interface List {
    id: Number,
    name: String,
    items?: ListItem[]
  }
  
export interface ListItem {
    id?: Number,
    primary: String,
    secondary?: String,
    checked: Boolean | Number,
    listId: Number
}
  