import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'loaders.css/loaders.min.css';

const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');
let loaderTextEl = null;

const formEl = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  if (!Array.isArray(images) || images.length === 0) return;

  const markup = images
    .map(
      img => `
<li class="gallery__item">
  <a class="gallery__link" href="${img.largeImageURL}">
    <img class="gallery__image" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item"><b>Likes</b><span>${img.likes}</span></p>
    <p class="info-item"><b>Views</b><span>${img.views}</span></p>
    <p class="info-item"><b>Comments</b><span>${img.comments}</span></p>
    <p class="info-item"><b>Downloads</b><span>${img.downloads}</span></p>
  </div>
</li>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  galleryEl.innerHTML = '';
}

export function showLoader(context = 'form') {
  if (loaderEl) loaderEl.style.display = 'flex';

  if (loaderTextEl) loaderTextEl.remove();

  loaderTextEl = document.createElement('p');
  loaderTextEl.classList.add('loader-text');
  loaderTextEl.textContent = 'Loading images, please wait...';

  if (context === 'form') {
    formEl.insertAdjacentElement('afterend', loaderTextEl);
  } else if (context === 'loadMore') {
    loadMoreBtn.insertAdjacentElement('afterend', loaderTextEl);
  }

  loaderTextEl.style.display = 'block';
}

export function hideLoader() {
  if (loaderEl) loaderEl.style.display = 'none';
  if (loaderTextEl) {
    loaderTextEl.remove();
    loaderTextEl = null;
  }
}

export function showLoadMoreButton() {
  if (loadMoreBtn) loadMoreBtn.style.display = 'block';
}

export function hideLoadMoreButton() {
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

export function getLoadMoreButton() {
  return loadMoreBtn;
}
