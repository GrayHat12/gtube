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
var ob = new Gtube("nf");
ob.on("cleared",()=>{
  console.log("cleared");
});
ob.on("addedItem",(item)=>{
  console.log(first,item.data.title);
});
ob.process(true).then((val)=>{
  console.log("done",val);
  first = false;
  ob.process(false).then((val)=>{
    console.log('done second');
  });
});