# gtube
 ytdl-core wrapper

# USAGE
~~~~
const { Gtube, Options } = require("gtube");
var op = new Options(true,10,null);
var ob = new Gtube("nf songs",op);
ob.process().then((val)=>{ // search
    //val=true for success
    //val=false for error
    if(val==true){
        var item = ob.items[0]; // get the first search item
        let videoInfo;
        ob.getItemData(item).then((dat)=>{
            videoInfo = dat; // the same video info you get with "ytdl-core"
            console.log(videoInfo);
        }).catch(console.error);
    }
}).catch(console.error);
~~~~