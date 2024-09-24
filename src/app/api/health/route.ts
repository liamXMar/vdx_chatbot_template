import axios from "axios";

const catImgUrl = 'https://api.thecatapi.com/v1/images/search?limit=10'

export async function getCatImgs() {
    try {
        const response = await axios.get(catImgUrl);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
