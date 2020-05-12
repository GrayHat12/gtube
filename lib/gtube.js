const Item = require('./Item');
const SearchTerm = require('./Search');
const events = require('events');

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
    constructor(search){
        super();
        /**
         * @member {String}
         * @default ""
         * @description Stores your search string
         * @private
         */
        this._search = search;
        /**
         * @member {String}
         * @default ""
         * @description Stores the nextPageRef
         * @private
         */
        this._nextpageref=null;
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
     * @param {object} callback - Callback when searching is done. Done assign this until you're absolutely
     * sure what you're doing
     * @fires cleared
     * @fires addedItem
     * @throws {Error}
     * @returns {Promise<Boolean>} is search was successful or ended with error
     */
    async process(newSearch=true,callback=this._callback){
        if(newSearch==true){
            this._nextpageref=null;
            this._items = [];
            /**
             * Indicates that all items have been cleared
             * @event Gtube#cleared
             */
            this.emit("cleared");
        }
        try{
            var ob;
            if(this._nextpageref==null){
                //console.log(this._nextpageref, 'is null');
                ob = new SearchTerm(this._search);
                //console.log('url in use is :',ob.url);
                var dat = await ob.search();
                callback(dat);
            }else{
                //console.log(this._nextpageref, 'is not null');
                ob = new SearchTerm(this._search,this._nextpageref);
                //console.log('url in use is :',ob.url);
                var dat = await ob.ContSearch();
                callback(dat);
            }
        }catch(ex){
            this._error = true;
            throw new Error(ex)
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
        this._nextpageref = result['nextpageRef'];
        //console.log('gtube',this._nextpageref.ctoken);
        //console.log('gtube',items[0]);
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
module.exports = Gtube;