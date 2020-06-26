import * as ytdl from 'ytdl-core';

export interface ItemInterface {
    type:string,
    live:boolean,
    title:string,
    link:string,
    thumbnail:string,
    author: {
        name:string,
        ref:string,
        verified:boolean
    },
    description:string,
    views:number|string,
    duration:string,
    uploaded_at:string
}

class Item {
    data:ItemInterface;
    constructor(itemData:ItemInterface|null) {
        this.data = itemData?itemData:{
            type:'video',
            live:false,
            title:'',
            link:'',
            thumbnail:'',
            author:{
                name:'',
                ref:'',
                verified:false,
            },
            description:'',
            views:0,
            duration:'00:00',
            uploaded_at:'',
        }
        this.getBasicItemData = this.getBasicItemData.bind(this);
        this.getItemData = this.getItemData.bind(this);
    }
    async getBasicItemData() {
        var vid = this.data.link.substring(this.data.link.indexOf('=')+1);
        return await ytdl.getBasicInfo(vid);
    }
    async getItemData() {
        return await ytdl.getInfo(this.data.link);
    }
    set setData(item:ItemInterface) {
        this.data = item;
    }
}

export default Item;