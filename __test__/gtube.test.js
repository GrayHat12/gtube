const { Gtube, Item, Options } = require("./../gtube");

var op = new Options(true,10,null);
var ob = new Gtube("nf songs",op);

var dic = {
  val: false,
  itemDataLinkLength: 0,
  formatLength: 0,
  item : new Item()
};

describe("testing gtube",()=>{
    let p = ob.process();
    it("running search",()=>{
        return p.then((val)=>{
            dic.val = val;
            dic.item = ob.items(0);
            dic.itemDataLinkLength = dic.item.data.link.length;
            p = dic.item.getItemData();
            expect(val).toBe(true);
        });
    },20000);
    it("search links",()=>{
        expect(dic.itemDataLinkLength>0).toBe(true);
    },20000);
    it("ytdl",()=>{
        return p.then((res)=>{
            dic.formatLength = res.formats.length;
            expect(dic.formatLength>0).toBe(true);
        });
    },40000);
});
