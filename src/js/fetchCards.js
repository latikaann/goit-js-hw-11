import axios from 'axios';

const API_KEY = '34559204-ec632097002210846bac1ec49';
const BASE_URL = 'https://pixabay.com/api/';
const params = '&image_type=photo&orientation=horizontal&safesearch=true';

export default class CardsApiPixabay {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchCards() {
    // console.log(this);
    try {
      const response = await axios.get(
        `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}${params}&per_page=${this.perPage}&page=${this.page}`
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  incrementPage() {
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
