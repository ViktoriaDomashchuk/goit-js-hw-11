import axios from 'axios';
import { Notify } from 'notiflix';

const KEY = '31688574-69e068f4257072d54456bdc7a';
const BASE_URL = 'https://pixabay.com/api/';
const parameters =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImg() {
    const resp = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${parameters}&page=${this.page}&per_page=${this.per_page}`
    );

    return resp.data;
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
