import Options from './option';
import Item from "./Item";
import SearchTerm, { Response } from "./Search";

interface ClearedCallback {
    () : void
}
interface AddedItemCallback {
    (item:Item) : void
}
interface SearchCompleteCallback {
    () : void
}
class Gtube {
    private search: string;
    private nextpageref: Options | null;
    private error: boolean;
    private onCleared: ClearedCallback;
    private onAddedItem: AddedItemCallback;
    private onCompletedSearch: SearchCompleteCallback;
    private items: Item[];
    constructor(search: string) {
        this.search = search;
        this.nextpageref = null;
        this.error = false;
        this.onCleared = () => null;
        this.onAddedItem = (item:Item) => null;
        this.onCompletedSearch = () => null;
        this.items = new Array<Item>();
        this.clearItems = this.clearItems.bind(this);
        this.process = this.process.bind(this);
        this.callback = this.callback.bind(this);
        this.completedSearch = this.completedSearch.bind(this);
        this.addedItem = this.addedItem.bind(this);
        this.item = this.item.bind(this);
    }
    async process(newSearch: boolean = true) {
        if (newSearch) {
            this.nextpageref = null;
            this.clearItems();
        }
        try {
            var ob: SearchTerm = new SearchTerm(this.search, this.nextpageref);
            if (this.nextpageref === null) {
                var op = ob.getOptions;
                op.ctoken = null;
                op.itct = null;
                ob.setOptions = op;
                var response:Response = await ob.search();
                this.callback(response);
            } else {
                var op = ob.getOptions;
                op.ctoken = this.nextpageref.ctoken;
                op.itct = this.nextpageref.itct;
                ob.setOptions = op;
                ob.addPrev();
                var response:Response = await ob.contSearch();
                this.callback(response);
            }
        } catch(err) {
            this.error = true;
            throw new Error(err);
        }
        return !this.error;
    }
    item(index: number) {
        return this.items[index];
    }
    private clearItems() {
        this.items = new Array<Item>();
        this.onCleared();
    }
    private callback(result: Response) {
        var items = result.items;
        this.nextpageref = result.nextpageRef;
        for(var i=0;i<items.length;i++){
            if(items[i]['type']=='video'){
                var item = new Item(items[i]);
                this.items.push(item);
                this.addedItem(item);
            }
        }
        this.completedSearch();
    }
    private completedSearch() {
        this.onCompletedSearch();
    }
    private addedItem(item:Item) {
        this.onAddedItem(item);
    }
    set onClear(callback: ClearedCallback) {
        this.onCleared = callback;
    }
    set onItemAdded(callback:AddedItemCallback) {
        this.onAddedItem = callback;
    }
    set onSearchComplete(callback:SearchCompleteCallback) {
        this.onCompletedSearch = callback;
    }
    set setSearch(term: string) {
        this.search = term;
    }
    get size() {
        return this.items.length;
    }
    get options() {
        return this.nextpageref;
    }
    get getSearch() {
        return this.search;
    }
    get itemArray() {
        return this.items;
    }
}

export default Gtube;