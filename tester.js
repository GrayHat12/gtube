const { Gtube, Item } = require("./../gtube");
var ob = new Gtube("nf songs");

ob.on("cleared",()=>{
  console.log("removed all items");
});
ob.on("addedItem",(item)=>{
  console.log(item.data.title);
  item.getBasicItemData().then((val)=>{
    console.log(val);
  });
});
ob.process(true);