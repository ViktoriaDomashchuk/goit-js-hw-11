import axios from 'axios';
import { Notify } from 'notiflix';

const KEY = '31688574-69e068f4257072d54456bdc7a';
const BASE_URL = 'https://pixabay.com/api/';
const parameters =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImg() {
    try {
      const resp = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${parameters}&page=${this.page}&${this.per_page}`
      );

      const data = resp.data;

      if (this.page === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      } else if (data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      this.page += 1;
      return data;
    } catch (err) {
      console.log(err);
    }
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
