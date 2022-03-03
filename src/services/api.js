import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
});

export default api;