"use strict";
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const events = require('events');

const Majordata = {
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
 * @classdesc Class representing the options that are used with ytdl.
 * @author GrayHat <grayhathacks10@gmail.com>
 */
class Options {
    /**
     * @description Represents an Option
     * @constructor
     * @param {Boolean} safeSearch - filter adult content, @default true
     * @param {int} limit - maximum results at a time, @default 20
     * @param {String} nextpageRef - reference from previous page @default null
     */
    constructor(safeSearch=true,limit=20,nextpageRef=null){
        /**
         * @default true
         */
        this.safeSearch = safeSearch;
        /**
         * @default 20
         */
        this.limit = limit;
        /**
         * @default null
         */
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
     * @constructor
     * @param {Object} item - Contains the video data
     */
    constructor(item = Majordata){
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
     * @description Represents a YouTube instance
     * @constructor
     * @param {String} search - Search string
     * @param {Options} options - Options
     */
    constructor(search,options=new Options()){
        super();
        /**
         * @member {String}
         * @default ""
         * @description Stores your search string
         * @private
         */
        this._search = search;
        /**
         * @member {Options}
         * @description Stores the Options object to be sent with ytdl
         * @default new Options()
         * @private
         */
        this._options = options;
        /**
         * @member {Boolean}
         * @default false
         * @description if ytdl had an error
         * @private
         */
        this._error = false;
        /**
         * @member {Array}
         * @default new Array<Item>();
         * @description Item list retrieved on search
         * @private
         */
        this._items = [];
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
        this._error=false;
        if(newSearch){
            this._options.nextpageRef=null;
            this._items = [];
            /**
             * Indicates that all items have been cleared
             * @event Gtube#cleared
             */
            this.emit("cleared");
        }
        const val = await ytsr(this._search,this._options.getMap());
        try{
            callback(val);
        }catch(ex){
            this._error = true;
            throw new Error(ex+'\n'+val)
        }
        return !this._error;
    }
    /**
     * @description This is the default callback for this.process
     * @access private
     * @private
     * @param {Object} result - Represents a result object
     */
    _callback(result){
        var items = result['items'];
        this._options.nextpageRef = result['nextpageRef'];
        for(var i=0;i<items.length;i++){
            if(items[i]['type']=='video'){
                var item = new Item(items[i]);
                this._items.push(item);
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
     * @description get item at index
     * @public
     * @returns {Item}
     * @method
     */
    item(index){
        return this._items[index];
    }
    /**
     * @description length of items
     * @public
     * @returns {Number}
     * @method
     */
    get size(){
        return this._items.length;
    }
    /**
     * @description get current Options
     * @method
     * @public
     * @returns {Options}
     */
    get options(){
        return this._options;
    }
    /**
     * @description get current search string
     * @method
     * @public
     * @returns {String}
     */
    get search(){
        return this._search;
    }
}

module.exports = {
    Options : Options,
    Gtube : Gtube,
    Item : Item
}