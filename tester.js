const { Gtube, Item } = require("./../gtube");
var ob = new Gtube("nf songs");

var dic = {
  val: false,
  itemDataLinkLength: 0,
  formatLength: 0,
};
async function next(item) {
    var res = await ob.getItemData(item);
    dic.formatLength = res['player_response']["streamingData"]["formats"].length;
}
async function nnext(item) {
    dic.itemDataLinkLength = item.data.link.length;
    await next(item);
}

let work = ob.process().then(async (val) => {
    dic.val = val;
    let item = ob.items[0];
    await nnext(item);
    return dic;
  }).catch((err) => {
    console.error(err);
    return dic;
});
work.then((dic)=>{
    console.log(dic);
});