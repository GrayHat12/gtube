const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

/** 
 * @classdesc Class representing the options that are used with ytdl.
 */
class Options {
    /**
     * @default true
     */
    safeSearch=true;
    /**
     * @default 20
     */
    limit=20;
    /**
     * @default null
     */
    nextpageRef=null;
    /**
     * @description Represents an Option
     * @constructor
     * @param {Boolean} safeSearch - filter adult content
     * @param {int} limit - maximum results at a time
     * @param {String} nextpageRef - reference from previous page
     */
    constructor(safeSearch=true,limit=20,nextpageRef=null){
        this.safeSearch = safeSearch;
        this.limit = limit;
        this.nextpageRef = nextpageRef;
        this.getMap = this.getMap.bind(this);
    }
    /**
     * @description returns the options as an object to be passed to ytdl
     * @returns {Object} Object data for passing to ytdl
     */
    getMap(){
        return {
            safeSearch : this.safeSearch,
            limit : this.limit,
            nextpageRef : this.nextpageRef
        };
    }
}
/** 
 * @classdesc Class representing a video Item.
 */
class Item {
    /**
     * @default {
            type:'video',
            live:false,
            title:'',
            link:'',
            thumbnail:'',
            author:{
                name:'',
                ref:'',
                verified:false
            },
            description:'',
            views:0,
            duration:'00:00',
            uploaded_at:'',
        }
     */
    data = {
        type:'video',
        live:false,
        title:'',
        link:'',
        thumbnail:'',
        author:{
            name:'',
            ref:'',
            verified:false
        },
        description:'',
        views:0,
        duration:'00:00',
        uploaded_at:'',
    }
    /**
     * @constructor
     * @param {Object} item - Contains the video data
     */
    constructor(item=this.data){
        this.data = item;
    }
}
/** 
 * @classdesc Class representing a YouTube instance.
 */
class Gtube {
    /**
     * @member {String}
     * @default ""
     * @description Stores your search string
     * @private
     */
    #search="";
    /**
     * @member {Options}
     * @description Stores the Options object to be sent with ytdl
     * @default new Options()
     * @private
     */
    #options=new Options();
    /**
     * @member {Boolean}
     * @default false
     * @description if ytdl had an error
     * @private
     */
    #error=false;
    /**
     * @member {[]}
     * @default new Array<Item>();
     * @description Item list retrieved on search
     * @private
     */
    #items=[];
    /**
     * @description Represents a YouTube instance
     * @constructor
     * @param {String} search - Search string
     * @param {Options} options - Options
     */
    constructor(search,options=this.#options){
        this.#search = search;
        this.#options = options;
        this.process = this.process.bind(this);
        this._callback = this._callback.bind(this);
        this.getItemData = this.getItemData.bind(this);
    }
    /**
     * @description this method searches the provided search string on Youtube for video results.
     * @async
     * @public
     * @access public
     * @param {Boolean} newSearch - Defines if we are continuing search or starting a new one
     * @param {function} callback - Callback when searching is done. Done assign this until you're absolutely
     * sure what you're doing
     * @throws {Error}
     * @returns {Promise<Boolean>} is search was successful or ended with error
     */
    async process(newSearch=false,callback=this._callback){
        this.#error=false;
        if(newSearch){
            this.#options.nextpageRef=null;
            this.#items = [];
        }
        const val = await ytsr(this.#search,this.#options.getMap());
        try{
            callback(val);
        }catch(ex){
            this.#error = true;
            throw new Error(ex+'\n'+val)
        }
        return !this.#error;
    }
    /**
     * @description This is the default callback for this.process
     * @access private
     * @private
     * @param {Object} result - Represents a result object
     */
    _callback(result){
        var items = result['items'];
        this.#options.nextpageRef = result['nextpageRef'];
        for(var i=0;i<items.length;i++){
            if(items[i]['type']=='video'){
                var item = new Item(items[i]);
                this.#items.push(item);
            }
        }
    }
    /**
    * @param {Item} item - Video Item
    * @access public
    * @description Get ytdl videoInfo
    * @async
    * @public
    * @returns {Promise<Object>} ytdl.videoInfo
    */
    async getItemData(item){
        var videoInfo = await ytdl.getInfo(item.data.link);
        //console.debug(videoInfo);
        return videoInfo;
    }
    /**
     * @description Get Basic ytdl information
     * @param {Item} item - Video Item
     * @access public
     * @async
     * @method
     * @public
     * @returns {Object} ytdl.videoInfo
     */
    async getBasicItemData(item){
        var videoInfo = await ytdl.getBasicInfo(item.data.link);
        return videoInfo;
    }
    /**
     * @description get current list of items
     * @public
     * @method
     */
    get items(){
        return this.#items;
    }
    /**
     * @description get current Options
     * @method
     * @public
     */
    get options(){
        return this.#options;
    }
    /**
     * @description get current search string
     * @method
     * @public
     */
    get search(){
        return this.#search;
    }
}

module.exports = {
    Options : Options,
    Gtube : Gtube,
    Item : Item
}