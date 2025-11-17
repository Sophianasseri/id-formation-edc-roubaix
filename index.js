import { fetchCitiesData } from "./fetch.js";
import { fetchCatsData } from "./fetch.js";
import { burgerMenu } from "./functions.js";
import { addFav } from "./functions.js";


const input = document.getElementById('cityInput');
const suggestionContainer = document.getElementById('suggestions');
const toggle = document.querySelector('.dropdown__toggle');
const menuDropdown= document.querySelector('.dropdown__menu');
const options = document.querySelectorAll('.option');
const randomCatsContainer = document.querySelector('#random-cats');
const researchedCatsContainer = document.querySelector('#researched-cats');



addFav()

burgerMenu()


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



//Slider

function initCarousel(containerSelector) {
  const slideContainer = document.querySelector(containerSelector);
  if (!slideContainer) return;

  const cardContainer = slideContainer.querySelector(".card-container");
  const nextBtn = slideContainer.querySelector(".catNext");
  const prevBtn = slideContainer.querySelector(".catPrev");

  if (!cardContainer) return;

  let pressed = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const setPosition = (translateX) => {
    cardContainer.style.transform = `translateX(${translateX}px)`;
  };
  const getMaxTranslate = () => {
    const outerWidth = slideContainer.offsetWidth;
    const innerWidth = cardContainer.scrollWidth;
    return -(innerWidth - outerWidth + 180);
  };

  // --- Mouse events ---
  slideContainer.addEventListener("mousedown", (e) => {
    pressed = true;
    startX = e.pageX;
    cardContainer.style.cursor = "grabbing";
  });

  slideContainer.addEventListener("mouseup", () => {
    pressed = false;
    prevTranslate = currentTranslate;
    cardContainer.style.cursor = "grab";
  });

  slideContainer.addEventListener("mouseleave", () => {
    if (pressed) {
      pressed = false;
      prevTranslate = currentTranslate;
    }
  });

  slideContainer.addEventListener("mousemove", (e) => {
    if (!pressed) return;
    const diff = e.pageX - startX;
    currentTranslate = clamp(prevTranslate + diff, getMaxTranslate(), 0);
    setPosition(currentTranslate);
  });

  // --- Touch events ---
  slideContainer.addEventListener("touchstart", (e) => {
    pressed = true;
    startX = e.touches[0].clientX;
  });

  slideContainer.addEventListener("touchend", () => {
    pressed = false;
    prevTranslate = currentTranslate;
  });

  slideContainer.addEventListener("touchmove", (e) => {
    if (!pressed) return;
    const diff = e.touches[0].clientX - startX;
    currentTranslate = clamp(prevTranslate + diff, getMaxTranslate(), 0);
    setPosition(currentTranslate);
  });

  // --- Buttons ---
  const scrollByCard = (direction) => {
    if (!cardContainer.children.length) return;
    const cardWidth = cardContainer.children[0].offsetWidth + 16;
    currentTranslate = clamp(
      currentTranslate + direction * cardWidth,
      getMaxTranslate(),
      0
    );
    prevTranslate = currentTranslate;
    setPosition(currentTranslate);
  };

  nextBtn?.addEventListener("click", () => scrollByCard(-1));
  prevBtn?.addEventListener("click", () => scrollByCard(1));
   
}

document.addEventListener("DOMContentLoaded", () => {
  initCarousel(".selected-cats-container");
  initCarousel(".testimony-card-container");
  initCarousel(".researched-cats-container");
});



const renderCats = (cats, container) => {
  container.innerHTML = cats.map(cat => `
    <a href="./catPage.html?id=${cat.id}" class="home-card">
      <div id="fav-container" class="fav-container">
        <img class="fav" src="./images/icones/favoris.svg" alt="favoris" />
        <img class="fav-full" src="./images/icones/favoris-ajout.svg" alt="favoris" />
      </div>
      <svg width="0" height="0" style="position:absolute">
        <defs>
          <clipPath id="round-shape" clipPathUnits="objectBoundingBox">
            <path d="
              M1,0.531
              C1,0.825,0.826,0.947,0.566,0.993
              C0.301,1,0,0.82,0,0.525
              C0,0.231,0.234,0,0.502,0
              C0.771,0,1,0.236,1,0.531
              Z" />
          </clipPath>
        </defs>
      </svg>
      <img class="home-card-image" src="./images/cats/${cat.id}/${cat["cover-img"]}" alt="${cat.name}" />
      <div class="home-card-text">
        <h3 class="home-card-title">${cat.name}</h3>
        <div class="home-card-info">
          <div>
            <p>${cat.age}</p>
            <p>${cat.city}</p>
          </div>
          <div class="home-card-gender">
            <img class="gender" src="./images/icones/${cat.gender}.svg" alt="${cat.gender}"/>
          </div>
        </div>
      </div>
    </a>
  `).join('');

 addFav()
};

const displayRandomCats = async () => {
  const cats = await fetchCatsData();

  const availableCats = cats.filter(cat => !cat.reserved && !cat.fair);
  const selectedCats = availableCats
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  renderCats(selectedCats, randomCatsContainer);
};

const displayResearchedCats = async () => {
  const cats = await fetchCatsData();

  const selectedCats = cats
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  renderCats(selectedCats, researchedCatsContainer);
};

displayRandomCats();
displayResearchedCats();

