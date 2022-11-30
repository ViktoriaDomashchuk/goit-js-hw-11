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

refs.btn.classList.add('is-hidden');

const pixabayImg = new NewsApiService();
const lastPage = 40;

async function onSearchImg(e) {
  e.preventDefault();
  pixabayImg.query = e.currentTarget.elements.searchQuery.value.trim();

  if (pixabayImg.query === '') {
    return Notify.info('Please enter the query parameters.');
  }

  pixabayImg.resetPage();
  try {
    await pixabayImg.fetchImg().then(hits => {
      clearMarkup();
      createMarkup(hits);
      refs.btn.classList.remove('is-hidden');

      if (hits.length === 0) {
        refs.btn.classList.add('is-hidden');
      }

      if (hits.length < lastPage) {
        refs.btn.classList.add('is-hidden');
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function onClickMoreImg() {
  pixabayImg.fetchImg().then(createMarkup);
}

function clearMarkup() {
  refs.list.innerHTML = '';
}

function createMarkup(hits) {
  console.log(hits);
  const markup = hits
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

  refs.list.insertAdjacentHTML('beforeend', markup);

  const gallery = new SimpleLightbox('.gallery a', {
    captionDelay: 200,
  });

  gallery.refresh();
}
