import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  getLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

const loadMoreBtn = getLoadMoreButton();

form.addEventListener('submit', async e => {
  e.preventDefault();
  currentQuery = e.target['search-text'].value.trim();

  if (!currentQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
    });
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader('form');

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader();

    if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
      iziToast.error({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    totalHits = data.totalHits;
    createGallery(data.hits);

    if (currentPage * 15 < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching images.',
    });
    console.error(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader('loadMore');

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader();

    if (data.hits.length) {
      createGallery(data.hits);

      const cardHeight = document
        .querySelector('.gallery li')
        .getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (currentPage * 15 < totalHits) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
        iziToast.info({
          title: 'End of results',
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching more images.',
    });
    console.error(error);
  }
});
