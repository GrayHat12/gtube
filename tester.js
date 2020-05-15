const Gtube = require("./lib/gtube");
const fs = require('fs');

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}
var first = true;
var ob = new Gtube("nf songs");
ob.on("cleared",()=>{
  console.log("cleared");
});
ob.on("addedItem",(item)=>{
  console.log(first,item.data.title);
  storeData(item,'item.json');
});
ob.process(true).then((val)=>{
  console.log("done",val);
  first = false;
  ob._search = "eminem darling";
  ob.process(true).then((val)=>{
    console.log('done second');
  });
});