import { fetchCatsData } from "./fetch.js";
import {burgerMenu} from"./functions.js";
import { fetchCitiesData } from "./fetch.js";
import { addFav } from "./functions.js";

const input = document.getElementById('cityInput');
const suggestionContainer = document.getElementById('suggestions');
const toggle = document.querySelector('.dropdown__toggle');
const menuDropdown= document.querySelector('.dropdown__menu');
const options = document.querySelectorAll('.option');
const filterBtn  =document.querySelector('.filter-btn');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close-btn')



let cities = [];

const getCities = async () => {
  cities = await fetchCitiesData()
}

getCities();

const showSuggestions = (filteredCities) => {
  suggestionContainer.innerHTML = '';

  if(!filteredCities || filteredCities.length === 0){
    suggestionContainer.classList.remove('active');
    return;
  }
  filteredCities.forEach(city => {
    const div = document.createElement('div');
    div.textContent = city.name;
    div.classList.add('suggestion-item');

    div.addEventListener('click', () => {
      input.value = city.name;
      suggestionContainer.innerHTML = '';
      suggestionContainer.classList.remove('active');
    });
    suggestionContainer.appendChild(div);
  });
  suggestionContainer.classList.add('active');
};

input.addEventListener('input', () => {
  const query = input.value.toLowerCase();
  if (!query) {
    suggestionContainer.innerHTML = '';
    suggestionContainer.classList.remove('active');
    return;
  }

  const filtered = cities.filter(city =>
    city.name.toLowerCase().split(' ').some(word => word.startsWith(query))
  );

  showSuggestions(filtered);
});

document.addEventListener('click', (e) => {
  if (!suggestionContainer.contains(e.target) && e.target !== input) {
    suggestionContainer.innerHTML = '';
    suggestionContainer.classList.remove('active');
  }
});

const toggler = () => {
  menuDropdown.classList.toggle('active');
};

toggle.addEventListener('click', toggler);

const setValue = (element) => {
  toggle.firstChild.textContent = element.textContent + ' ';
  menuDropdown.classList.remove('active');
};

options.forEach((item) => {
  item.addEventListener('click', () => setValue(item));
  item.addEventListener('keydown', (e) => {
    if (e.code === 'Space') setValue(item);
  });
});



const catsContainer = document.querySelector('.cats-results'); 


burgerMenu()



let cats = []

const getCats = async () => {
  cats = await fetchCatsData()
  catsContainer.innerHTML = cats
    .map(cat => `
      <a class="cat-card" href="./catPage.html?id=${cat.id}">
       <div class="fav-container">
              <img class="fav" src="./images/icones/favoris.svg" alt="favoris"/>
              <img class="fav-full" src="./images/icones/favoris-ajout.svg" alt="favoris"/>
        </div>
          <img class="cat-card-cover" src="./images/cats/${cat.id}/${cat["cover-img"]}" alt="${cat.name}"/>
          ${cat.reserved ? `<div class="reserved-tag"><p>En attente</p></div>` : ''}
        <div class="cat-card-text">
          <div>
            <h3>${cat.name}</h3>
            <p>${cat.age}</p>
            <p>${cat.city}</p>
           </div>
          <img class="gender" src="./images/icones/${cat.gender}.svg" alt="${cat.gender}"/>
        </div>
      </a>
    `)
    .join('')
    addFav()
}

getCats()

filterBtn.addEventListener('click', (e) => {
  modal.style.display = "block";
});

closeBtn.addEventListener('click', () => {
  modal.style.display = "none";
});


document.querySelector('.filters').addEventListener('click', (e) => {
  e.stopPropagation();
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});