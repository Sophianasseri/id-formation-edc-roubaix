import { burgerMenu } from "./functions.js";
import {fetchCatsData} from "./fetch.js";

burgerMenu()

const catsResults = document.querySelector('.cats-results');

let cats = []

const dispplayFairCats = async () => {
    cats = await fetchCatsData()
      const fairCats = cats.filter(cat => cat.fair)

       catsResults.innerHTML = fairCats
    .map(cat => `
      <a class="cat-card" href="./catPage.html?id=${cat.id}">
       <div class="fav-container">
              <img class="fav" src="./images/icones/favoris.svg" alt="favoris"/>
              <img class="fav-full" src="./images/icones/favoris-ajout.svg" alt="favoris"/>
        </div>
          <img class="cat-card-cover" src="./images/cats/${cat.id}/${cat["cover-img"]}" alt="${cat.name}"/>
          ${cat.reserved ? `<div class="reserved-tag"><p>Visite</p></div>` : ''}
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
}

dispplayFairCats();