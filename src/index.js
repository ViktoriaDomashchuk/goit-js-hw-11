import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from './pixabay';

const refs = {
  form: document.querySelector('#search-form'),
  list: document.querySelector('.gallery'),
  btn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchImg);
refs.btn.addEventListener('click', onClickMoreImg);

const pixabayImg = new NewsApiService();

let gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 200,
});

let currentPage = 0;

function onSearchImg(e) {
  e.preventDefault();
  clearMarkup();
  refs.btn.classList.add('is-hidden');

  pixabayImg.query = e.currentTarget.elements.searchQuery.value.trim();
  currentPage = 0;

  pixabayImg.resetPage();

  if (!pixabayImg.query) {
    Notify.info('Please enter the query parameters.');
    return;
  }

  fetchImg();
}

function clearMarkup() {
  refs.list.innerHTML = '';
}

function createMarkup(arr) {
  return arr
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
        return `<div class="gallery__card">
  <div>
    <a class="gallery__link" href="${largeImageURL}">
      <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
  </div>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
 </div>`;
      }
    )
    .join('');
}

function pushGallery(arr) {
  refs.list.insertAdjacentHTML('beforeend', createMarkup(arr));
}

function onClickMoreImg() {
  fetchImg();
}

async function fetchImg() {
  try {
    const data = await pixabayImg.fetchImg();

    refs.btn.classList.remove('is-hidden');

    pixabayImg.nextPage();

    currentPage += data.hits.length;

    if (currentPage === data.hits.length) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (!data.hits.length) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    pushGallery(data.hits);
    gallery.refresh();

    if (pixabayImg.page === Math.ceil(data.totalHits / pixabayImg.per_page)) {
      refs.btn.classList.add('is-hidden');

      Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
    }
  } catch (error) {
    console.log(error);
  }
}
