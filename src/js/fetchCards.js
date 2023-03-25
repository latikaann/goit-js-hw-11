const API_KEY = '34559204-ec632097002210846bac1ec49';
const BASE_URL = 'https://pixabay.com/api/';
const params = '&image_type=photo&orientation=horizontal&safesearch=true';

export default function fetchCards(searchQuery) {
  return fetch(`${BASE_URL}/?key=${API_KEY}&q=${searchQuery}${params}`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}
