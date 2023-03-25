import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import fetchCards from './js/fetchCards';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  submitBtn: document.querySelector('.btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryBox: document.querySelector('.gallery'),
};

const { form, input, submitBtn, loadMoreBtn, galleryBox } = refs;
//

form.addEventListener('submit', onSearchForm);
//
//    LIGHTBOX
//
//
let gallery = new SimpleLightbox('.gallery a');
//
//
function onSearchForm(e) {
  //   console.log(e.currentTarget.elements.searchQuery.value);
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.searchQuery.value;

  fetchCards(searchQuery)
    .then(cards => {
      console.log(cards);
      renderCards(cards);
    })
    .catch(error => {
      console.log(error);
    });
}

function renderCards(cards) {
  console.log(cards.hits);
  const markup = cards.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
      <a href="${largeImageURL}">
              <img
              class="gallery__image img"
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
            />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  galleryBox.insertAdjacentHTML('beforeend', markup);
}
