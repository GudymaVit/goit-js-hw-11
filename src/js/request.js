import axios from 'axios';
const API_KEY = '27264986-7652febb8acf881c536036047';
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiReuest{
    constructor(){
        this.searchQuery ='';
        this.page = 1;
    }
    async fetchSearch() {        
        const option = new URLSearchParams({
            key: API_KEY,
            q: `${this.searchQuery}`,
            image_type: 'photo',
            orientation: "horizontal",
            safesearch: 'true',
            per_page: '40',
            page: `${this.page}`,
        })
        const respounse = await axios.get(`${BASE_URL}?${option}`);
        
        return respounse.data;        
    }
    get query() {
        return this.serchQuery;
    }
    set query(newQuery){
        this.searchQuery = newQuery;
    }

    incrementPage(){
        this.page += 1;
    }
    resetPage(){
        this.page = 1;
    }
}