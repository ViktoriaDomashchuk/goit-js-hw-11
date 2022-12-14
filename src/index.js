import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ApiService from './pixabay';

const refs = {
  form: document.querySelector('#search-form'),
  list: document.querySelector('.gallery'),
  btn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchImg);
refs.btn.addEventListener('click', onLoadMore);
refs.btn.classList.add('is-hidden');

const pixabayImg = new ApiService();

const maxImgOnpage = 40;
let image = 1;

async function onSearchImg(e) {
  e.preventDefault();

  clearMarkup();

  pixabayImg.query = e.currentTarget.elements.searchQuery.value.trim();

  image = 1;

  if (!pixabayImg.query) {
    Notify.info('Please enter the query parameters.');
    return;
  }

  refs.btn.classList.add('is-hidden');

  pixabayImg.resetPage();

  try {
    await pixabayImg.fetchImg().then(data => {
      clearMarkup();
      createMarkup(data);

      if (data.hits.length === maxImgOnpage) {
        refs.btn.classList.remove('is-hidden');
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function onLoadMore() {
  try {
    await pixabayImg.fetchImg().then(data => {
      createMarkup(data);
      image += 1;

      if (image === Math.floor(data.totalHits / maxImgOnpage)) {
        refs.btn.classList.add('is-hidden');

        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function createMarkup({ hits }) {
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

  let gallery = new SimpleLightbox('.gallery a', {
    captionDelay: 200,
  });

  gallery.refresh();
}

function clearMarkup() {
  refs.list.innerHTML = '';
}
