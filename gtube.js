const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const events = require('events');

/** 
 * @classdesc Class representing the options that are used with ytdl.
 * @author GrayHat <grayhathacks10@gmail.com>
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
 * @author GrayHat <grayhathacks10@gmail.com>
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
        this.getItemData = this.getItemData.bind(this);
        this.getBasicItemData = this.getBasicItemData.bind(this);
    }
    /**
     * @description Get Basic ytdl information
     * @param {Item} item - Video Item
     * @access public
     * @async
     * @method
     * @public
     * @returns {Promise<Object>} ytdl.videoInfo
     */
    async getBasicItemData(){
        var videoInfo = await ytdl.getBasicInfo(this.data.link);
        return videoInfo;
    }
    /**
    * @param {Item} item - Video Item
    * @access public
    * @description Get ytdl videoInfo
    * @async
    * @public
    * @returns {Promise<Object>} ytdl.videoInfo
    */
   async getItemData(){
       var videoInfo = await ytdl.getInfo(this.data.link);
       //console.debug(videoInfo);
       return videoInfo;
    }
}
/** 
 * @classdesc Class representing a YouTube instance.
 * @author GrayHat <grayhathacks10@gmail.com>
 * @extends events.EventEmitter
 */
class Gtube extends events.EventEmitter {
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
     * @member {Array}
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
    constructor(search,options=new Options()){
        super();
        this.#search = search;
        this.#options = options;
        this.process = this.process.bind(this);
        this._callback = this._callback.bind(this);
    }
    /**
     * @description this method searches the provided search string on Youtube for video results.
     * @async
     * @public
     * @access public
     * @param {Boolean} newSearch - Defines if we are continuing search or starting a new one
     * @param {function} callback - Callback when searching is done. Done assign this until you're absolutely
     * sure what you're doing
     * @fires cleared
     * @fires addedItem
     * @throws {Error}
     * @returns {Promise<Boolean>} is search was successful or ended with error
     */
    async process(newSearch=false,callback=this._callback){
        this.#error=false;
        if(newSearch){
            this.#options.nextpageRef=null;
            this.#items = [];
            /**
             * Indicates that all items have been cleared
             * @event Gtube#cleared
             */
            this.emit("cleared");
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
                /**
                 * A new item has been added
                 * @event Gtube#addedItem
                 * @property {Item} item
                 */
                this.emit("addedItem",item);
            }
        }
    }
    /**
     * @description get current list of items
     * @public
     * @returns {Item}
     * @method
     */
    items(index){
        return this.#items[index];
    }
    /**
     * @description length of items
     * @public
     * @returns {Number}
     * @method
     */
    get size(){
        return this.#items.length;
    }
    /**
     * @description get current Options
     * @method
     * @public
     * @returns {Options}
     */
    get options(){
        return this.#options;
    }
    /**
     * @description get current search string
     * @method
     * @public
     * @returns {String}
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