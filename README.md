# gtube
 ytdl-core wrapper
 Made this package to easily use ytdl-core with Reactjs

# USAGE
~~~~
import { Gtube, Item } from "gtube";
// can also : const { Gtube, Item } = require("gtube);
var ob = new Gtube("nf songs");

ob.on("cleared",()=>{
  console.log("removed all items");
});
ob.on("addedItem",(item)=>{ // called when a single item is found
  console.log(item.data.title); // prints video title
  item.getBasicItemData().then((val)=>{
    console.log(val); // prints videoInfo
  });
});
ob.process(true);
~~~~