const { Gtube, Item } = require("./../gtube");
var ob = new Gtube("nf songs");
const fs = require('fs')

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}
ob.on("cleared",()=>{
  console.log("removed all items");
});
ob.on("addedItem",(item=new Item())=>{
  console.log(item.data.title);
  if(ob.size>1){
    return;
  }
  item.getBasicItemData().then((val)=>{
    //console.log(val);
    storeData(val,"data.json");
  }).catch(console.error);
});
ob.process(true);