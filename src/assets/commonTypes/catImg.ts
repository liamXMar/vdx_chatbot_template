/* example json :
* {"id":"6","url":"https://28.media.tumblr.com/tumblr_ks1a707b1b1qa9hjso1_1280.png",
* "width":507,"height":375},{"id":"381","url":"https://cdn2.thecatapi.com/images/381.jpg",
* "width":580,"height":808
* */

export type CatImg = {
    id: string;
    url: string;
    width: number;
    height: number;
}
