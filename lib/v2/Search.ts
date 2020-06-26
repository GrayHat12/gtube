import axios from 'axios';
import Option from './option';
import Item, { ItemInterface } from './Item';

const regex = /<script>\s*window\["ytInitialData"\]\s*=\s*({.*})/gm;

const defaultPlaylistUrl = "https://www.youtube.com/playlist?list=PL4fGSI1pDJn6puJdseH2Rt9sMvt9E2M4i";

export interface Response {
    items: ItemInterface[],
    nextpageRef: Option,
};

class SearchTerm {
    private options: Option;
    private headers: {
        'Accept-Encoding': string | any,
        'x-youtube-client-name': string | any,
        'x-youtube-client-version': string | any
    }
    private data: any;
    constructor(term: string, ref: Option | null) {
        if (ref === null || typeof ref === 'undefined') {
            this.options = {
                url: 'https://cors-grayhat.herokuapp.com/https://www.youtube.com/playlist?list=PL4fGSI1pDJn6puJdseH2Rt9sMvt9E2M4i',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
                    "dnt": 1
                },
                ctoken: null,
                itct: null
            }
        } else {
            this.options = ref;
        }
        this.options.url = 'https://www.youtube.com/results?pbj=1&search_query=' + encodeURI(term);
        this.headers = {
            'Accept-Encoding': 'gzip',
            'x-youtube-client-name': '1',
            'x-youtube-client-version': '2.20200508.00.01'
        }
        this.data = {};

        this.addPrev = this.addPrev.bind(this);
        this.search = this.search.bind(this);
        this.contSearch = this.contSearch.bind(this);
    }
    addPrev() {
        if (this.options.ctoken != null) {
            this.options.url += '&ctoken=' + this.options.ctoken;
            this.options.url += '&continuation=' + this.options.ctoken;
        }
        if (this.options.itct != null) {
            this.options.url += '&itct=' + this.options.itct;
        }
    }
    set setOptions(option: Option) {
        this.options = option;
    }
    get getOptions() {
        return this.options;
    }
    async search() {
        var res = await axios.get(this.options.url, { headers: this.headers });
        this.data = res.data;
        var items = new Array<ItemInterface>();
        var dat: [] = this.data[1]['response']['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents'];
        for (var i = 0; i < dat.length; i++) {
            var itm = dat[i]['videoRenderer'];
            if (!itm) continue;
            var newItem: ItemInterface = {
                type: 'video',
                title: '',
                link: '',
                thumbnail: '',
                author: {
                    name: '',
                    ref: '',
                    verified: false
                },
                description: '',
                views: 0,
                uploaded_at: '',
                duration: '',
                live: false
            };
            try {
                newItem.title = itm['title']['runs'][0]['text'];
            } catch (err) { };
            try {
                newItem.link = `https://www.youtube.com/watch?v=${itm['videoId']}`;
            } catch (err) { };
            try {
                var thumb: string | null = ''+itm['thumbnail']['thumbnails'][0]['url'];
                if (typeof thumb === 'string' && thumb !== null) newItem.thumbnail = thumb.substring(0, 49);
            } catch (err) { };
            try {
                newItem.author.name = itm['ownerText']['runs'][0]['text'];
            } catch (err) { };
            try {
                newItem.author.ref = 'https://www.youtube.com' + itm['ownerText']['runs'][0]['navigationEndpoint']['commandMetadata']['webCommandMetadata']['url'];
            } catch (err) { };
            try {
                newItem.author.verified = itm['ownerBadges']['metadataBadgeRenderer']['icon']['iconType'] == 'OFFICIAL_ARTIST_BADGE' ? true : false;
            } catch (err) {
                newItem.author.verified = false;
            };
            var desc: string = '';
            try {
                var tlist: [] = itm['descriptionSnippet']['runs'];
                for (var j = 0; j < tlist.length; j++) {
                    try {
                        var txt = tlist[j]['text'];
                        desc += txt;
                    } catch (err) { }
                }
            } catch (err) { };
            newItem.description = desc;
            try {
                newItem.views = itm['viewCountText']['simpleText'];
            } catch (err) { };
            try {
                newItem.uploaded_at = itm['publishedTimeText']['simpleText'];
            } catch (err) { };
            items.push(newItem);
        }
        var nref = this.data[1]['response']['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['continuations'][0]['nextContinuationData'];
        this.options.ctoken = nref['continuation'];
        this.options.itct = nref['clickTrackingParams'];
        var response: Response = {
            items: items,
            nextpageRef: this.options
        };
        return response;
    }
    async contSearch() {
        var res = await axios.get(this.options.url, { headers: this.headers });
        this.data = res.data;
        var items = new Array<ItemInterface>();
        var dat: [] = this.data[1]['response']['continuationContents']['itemSectionContinuation']['contents'];
        for (var i = 0; i < dat.length; i++) {
            try {
                var itm = dat[i]['videoRenderer'];
            } catch (err) { continue; };
            if (!itm) continue;
            var newItem: ItemInterface = {
                type: 'video',
                title: '',
                link: '',
                thumbnail: '',
                author: {
                    name: '',
                    ref: '',
                    verified: false
                },
                description: '',
                views: 0,
                uploaded_at: '',
                duration: '',
                live: false
            };
            try {
                newItem.title = itm['title']['runs'][0]['text'];
            } catch (err) { };
            try {
                newItem.link = `https://www.youtube.com/watch?v=${itm['videoId']}`;
            } catch (err) { };
            try {
                var thumb: string = itm['thumbnail']['thumbnails'][0]['url'];
                newItem.thumbnail = thumb.substring(0, 49);
            } catch (err) { };
            try {
                newItem.author.name = itm['ownerText']['runs'][0]['text'];
            } catch (err) { };
            try {
                newItem.author.ref = 'https://www.youtube.com' + itm['ownerText']['runs'][0]['navigationEndpoint']['commandMetadata']['webCommandMetadata']['url'];
            } catch (err) { };
            try {
                newItem.author.verified = itm['ownerBadges']['metadataBadgeRenderer']['icon']['iconType'] == 'OFFICIAL_ARTIST_BADGE' ? true : false;
            } catch (err) {
                newItem.author.verified = false;
            }
            var desc = '';
            try {
                var tlist: [] = itm['descriptionSnippet']['runs'];
                for (var j = 0; j < tlist.length; j++) {
                    try {
                        var txt = tlist[j]['text'];
                        desc += txt;
                    } catch (err) { };
                }
            } catch (err) { };
            try {
                newItem.description = desc;
            } catch (err) { };
            try {
                newItem.views = itm['viewCountText']['simpleText'];
            } catch (err) { };
            try {
                newItem.duration = itm['lengthText']['simpleText'];
            } catch (err) { };
            try {
                newItem.uploaded_at = itm['publishedTimeText']['simpleText'];
            } catch (err) { };
            items.push(newItem);
        }
        var nref = this.data[1]['response']['continuationContents']['itemSectionContinuation']['continuations'][0]['nextContinuationData'];
        this.options.ctoken = nref['continuation'];
        this.options.itct = nref['clickTrackingParams'];
        var response: Response = {
            items: items,
            nextpageRef: this.options
        };
        return response;
    }
    get Url() {
        return this.options.url;
    }
}

export default SearchTerm;