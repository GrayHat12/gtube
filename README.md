# gtube
 ytdl-core wrapper.
 Made this package to easily use ytdl-core with Reactjs

# USAGE
## using events
```css
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
```
## using promises
```css
import { Gtube, Item } from "gtube";
// can also : const { Gtube, Item } = require("gtube);
var ob = new Gtube("nf songs");

ob.process(true).then((val)=>{ // start searching
  if(val){ // search successful
    // ob.item(0) returns the first Item object from search
    // use ob.size for getting the size of Item list
    ob.item(0).getItemData().then((vidInfo)=>{ // get item's video info
      console.log(vidInfo); // log video info
    }).catch(console.error);
  }
}).catch(console.error);
```
# Gtube Complete Documentation
[see documentation here](https://grayhat12.github.io/gtube/)