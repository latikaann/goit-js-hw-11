import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import CardsApiPixabay from './js/fetchCards';

// =================== REFS
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  submitBtn: document.querySelector('.btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryBox: document.querySelector('.gallery'),
};

const { form, input, submitBtn, loadMoreBtn, galleryBox } = refs;

const cardsApiPixabay = new CardsApiPixabay();

form.addEventListener('submit', onSearchForm);

let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
}); //    LIGHTBOX

//gallery__scroll
// Скрытая кнопка

const hideLoadMoreBtn = () => (refs.loadMoreBtn.style.display = 'none');
const showLoadMoreBtn = () => (
  (refs.loadMoreBtn.style.display = 'block'),
  loadMoreBtn.addEventListener('click', onLoadMore)
);
hideLoadMoreBtn();

async function onSearchForm(e) {
  e.preventDefault();
  clearCardsGallery();
  cardsApiPixabay.query = e.currentTarget.elements.searchQuery.value.trim(); // ========== метод trim();
  cardsApiPixabay.resetPage();

  try {
    if (cardsApiPixabay.query === '') {
      hideLoadMoreBtn();
      // ======= нет запроса на путую строку
      Notiflix.Notify.failure('Please, fill in the field');
      return;
    }

    const cards = await cardsApiPixabay.fetchCards();
    renderCards(cards);

    if (cards.data.hits.length === 0) {
      hideLoadMoreBtn();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${cards.data.totalHits} images.`);
  } catch (error) {
    console.log(error.message);
  }
}

function renderCards(cards) {
  console.log(cards.data);
  showLoadMoreBtn();
  const markup = cards.data.hits
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
      <a class="photo-link" href="${largeImageURL}">
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
  gallery.refresh();
}

async function onLoadMore(e) {
  cardsApiPixabay.incrementPage();
  try {
    const cards = await cardsApiPixabay.fetchCards();
    renderCards(cards);

    // console.log(cards.data.totalHits);
    const totalPages = Math.ceil(
      cards.data.totalHits / cardsApiPixabay.perPage
    );
    // console.log(totalPages);
    if (totalPages <= cardsApiPixabay.page) {
      hideLoadMoreBtn();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error.message);
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearCardsGallery() {
  galleryBox.innerHTML = '';
  cardsApiPixabay.resetPage();
}
