import Item from "../lib/v2/Item";
import Gtube from '../lib/v2/gtube';

var ob = new Gtube('NF songs');

ob.onClear = ()=> console.log(5,'Cleared');
ob.onItemAdded = (item:Item) => console.log(item.data);
ob.onSearchComplete = () => console.log(7,'Search Complete');
console.log('here');
ob.process().then((val:boolean)=>{
    console.log(10,val);
    ob.process(false).then((val2:boolean)=>{
        console.log(12,val2);
        ob.setSearch = "Eminem Songs";
        ob.process().then((val3:boolean)=>{
            console.log(15,val3);
        }).catch(console.error);
    }).catch(console.error);
}).catch(console.error);