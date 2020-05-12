const ytdl = require('ytdl-core');
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
 * @classdesc Class representing a video Item.
 * @author GrayHat <grayhathacks10@gmail.com>
 */
class Item {
    /**
     * @constructor
     * @param {Object} item - Contains the video data
     */
    constructor(item=Majordata){
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
        this.setData = this.setData.bind(this);
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
        var vid = this.data.link.substring(this.data.link.indexOf('=')+1);
        //console.log(this.data.link);
        var videoInfo = await ytdl.getBasicInfo(vid);
        //console.log(vid,videoInfo);
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
    setData(item){
        this.data = item;
    }
}
module.exports = Item;