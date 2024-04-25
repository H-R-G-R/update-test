const list = document.querySelector('.js-card-list');
const loadMore = document.querySelector('.js-load-more');

// API
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// Params
let page = 1;
let perPage = 10;

// GET request
async function getPosts() {
  const params = new URLSearchParams({
    _limit: perPage,
    _page: page,
  });

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error('Помилка ' + response.status);
    }

    const posts = await response.json();
    console.log(posts);
    return posts;
  } catch (error) {
    console.error('Виникла проблема з вашим запитом на отримання: ', error);
  }
}

// Create markup
function renderPosts(posts) {
  const markup = posts
    .map(({ id, title }) => {
      return `
  <li class="card" data-id="${id}">
    <img src="https://optima.school/img/default.jpg" alt="${title}" >
    <div  class="card-info">
        <h2>${title}</h2>
        <p>Number: ${id}</p>
  
        <div class="btn-block">
            <button type="button" class="js-change">Сhange</button>
            <button type="button" class="js-remove">Remove</button>
        </div>
    </div>
  </li>
  `;
    })
    .join('');
  return markup;
}

/**
  |============================
  | Виклик функції
  |============================
*/
getPosts().then(posts => {
  list.insertAdjacentHTML('beforeend', renderPosts(posts));

  loadMore.classList.replace('load-more-hidden', 'load-more');

  // Додавання обробників подій для кнопок Remove та Change стандарт
  list.querySelectorAll('.js-remove').forEach(button => {
    button.addEventListener('click', onRemoveClick);
  });

  list.querySelectorAll('.js-change').forEach(button => {
    button.addEventListener('click', onChangeClick);
  });
});

/**
  |============================
  | Пагінація
  |============================
*/

loadMore.addEventListener('click', onLoadMore);
function onLoadMore() {
  page += 1;

  getPosts().then(posts => {
    list.insertAdjacentHTML('beforeend', renderPosts(posts));
    if (posts.length < perPage) {
      loadMore.style.display = 'none';
    }

    // Додавання обробників подій для нових кнопок Remove та Change
    list.querySelectorAll('.js-remove').forEach(button => {
      button.addEventListener('click', onRemoveClick);
    });

    list.querySelectorAll('.js-change').forEach(button => {
      button.addEventListener('click', onChangeClick);
    });
  });
}

/**
  |============================
  | Remove
  |============================
*/

async function onRemoveClick(event) {
  const card = event.target.closest('.card');
  const postId = card.dataset.id;

  try {
    const response = await fetch(`${BASE_URL}/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Не вдалося поділитися публікацією');
    }

    card.remove();
  } catch (error) {
    console.error('Виникла проблема з вашим запитом на видалення: ', error);
  }
}

/**
  |============================
  | Change
  |============================
*/
async function onChangeClick(event) {
  const card = event.target.closest('.card');
  const postId = card.dataset.id;
  const newTitle = prompt('Enter new title:');

  if (!newTitle) return;

  try {
    const response = await fetch(`${BASE_URL}/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!response.ok) {
      throw new Error('Не вдалося поділитися публікацією');
    }

    const cardTitle = card.querySelector('h2');
    cardTitle.textContent = newTitle;
  } catch (error) {
    console.error('Виникла проблема з вашим запитом на оновлення: ', error);
  }
}
