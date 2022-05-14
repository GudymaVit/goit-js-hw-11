import './css/styles.css';
import ApiReuest from './js/request';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import LoadMoreBtn from './js/loadMoreBtn';


let lightbox = new SimpleLightbox('.gallery a', {captionsData: 'alt', captionDelay: 250});

const userRequest = new ApiReuest();
const refs = {
    form: document.querySelector('#search-form'),
    searchBtn: document.querySelector('.search-btn'),
    gallery: document.querySelector('.gallery'),
    // loadMoreBtn: document.querySelector('.load-more')
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load"]',
  hidden: true,
});

refs.form.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', loadMore);

function onSearch(e){
  e.preventDefault();
  
  const searchData = (e.target.elements.searchQuery.value).trim();
  userRequest.query = searchData;
  userRequest.resetPage();
  
  if (searchData === '') {
      Notiflix.Notify.failure("type the search field");
        return;
  };
  loadMoreBtn.hide();
  clearGallery();
  fetchImag();
  e.target.reset();
};

async function fetchImag() {
  try {
    loadMoreBtn.show();
    loadMoreBtn.disable();
        const fetchData = await userRequest.fetchSearch();
    const images = fetchData.hits;

    if (fetchData.totalHits === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      loadMoreBtn.hide();
      return;
    }
    if (fetchData.totalHits < 40) {
      loadMoreBtn.hide();
    }
        searchMarkup(images);
        userRequest.incrementPage();
      lightbox.refresh();
      loadMoreBtn.enable();
      

        return fetchData;
    } catch (error) {
      Notiflix.Notify.failure(`${error.message}`);
    }
};

function loadMore() {
  fetchImag().then(data => {
    if ((data.totalHits) / 40 < userRequest.page) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
      loadMoreBtn.hide();
    }
  });    
}


function searchMarkup(images) {
    const markup = images.map((image) => {
      return `<a href="${image.largeImageURL}" class="gallery_link">
        <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b><br>${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b><br>${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b><br>${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b><br>${image.downloads}
            </p>
          </div>
        </div>
      </a>`
    }).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
};

function clearGallery() {
    refs.gallery.innerHTML = '';
}