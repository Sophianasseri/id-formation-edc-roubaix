import { fetchCatsData } from "./fetch.js";
import { fetchAdoptionFees } from "./fetch.js";
import {burgerMenu} from"./functions.js";
import { addFav } from "./functions.js";


const pageId = new URLSearchParams(window.location.search).get('id');
const catResumeContainer = document.querySelector('.cat-resume-container');
const catInfoContainer = document.querySelector('.cat-info-container')
const tagContainer = document.querySelector('.personality-tags-container');
const priceContainer = document.querySelector('.price-container');
const familyContainer = document.querySelector('.family-container');
const carouselContainer = document.querySelector('.carousel')
const carouselInner = document.querySelector('.carousel-inner');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const indicatorsContainer = document.querySelector('.carousel-indicators')
const relatedCatsContainer = document.querySelector('.card-container')


burgerMenu();

const carousel = async () => {
  const cats = await fetchCatsData()
  const cat = cats.find((element) => element.id === parseInt(pageId, 10));
  const images = cat.images

  let currentIndex = 0;

  carouselInner.innerHTML = images.map(img => `
    <img src="./images/cats/${cat.id}/${img}" alt="${cat.name}">
    `).join("");

      if (cat.reserved) {
    const reservedContainer = document.createElement('div');
    reservedContainer.classList.add('reserved-tag-carousel');
    reservedContainer.innerHTML = `
      <p>En attente</p>
    `;
    carouselContainer.appendChild(reservedContainer);
  }

  indicatorsContainer.innerHTML = images
  .map((_, index) => `<button data-index="${index}" class="${index === 0 ? 'active' : ''}"></button>`)
  .join("");
  
  const indicatorButtons = indicatorsContainer.querySelectorAll("button")
  
  const updateCarousel = () => {
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicatorButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentIndex);
    });
  };


  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  })

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel()
  })

  indicatorButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      currentIndex = parseInt(e.target.dataset.index);
      updateCarousel();
    })
  })

  let startX = 0

  carouselInner.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 ) {
        currentIndex = (currentIndex + 1) % images.length;
      } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      }
      updateCarousel()
    }
  })    
}


let cats = []

const getCatResume = async () => {
  cats = await fetchCatsData()
 
  const catId = cats.find((element) => element.id === parseInt(pageId,10))
  const genderText = catId.gender === "female" ? "Femelle" : "Mâle"


 catResumeContainer.innerHTML = `
  ${catId.reserved ? `<div class="reserved-container"><p>En attente: ce chat est en attente d’une visite mais il est toujours disponible à l’adoption</p></div>` : ''}
<div>
 <h1>${catId.name}</h1>
 <div class="info-container">
        <div class="cat-card-text">
    <div class="info-element">
        <img class="gender" src="./images/icones/${catId.gender}.svg" alt="sexe"/>
        <p>${genderText}</p>
    </div>
    <div class="info-element">
        <img src="./images/icones/age.svg" alt="âge"/>
        <p>${catId.age}</p>
    </div>
    <div class="info-element">
        <img src="./images/icones/sante.svg" alt="santé"/>
        <p>${catId.health}</p>
    </div>
    <div class="info-element">
        <img src="./images/icones/localisation.svg" alt="ville"/>
        <p>${catId.city}</p>
    </div>
 </div>
 <div class="compatibility-tag-container">
  ${catId["good-with-cats"] ? `<div class="compatibility-tag">
    <img src="./images/icones/ok-chat.svg" alt="Compatible avec les chats"/>
    <p>Compatible chats</p>
    </div>` : ''}
    ${catId["good-with-dogs"] ? `<div class="compatibility-tag">
    <img src="./images/icones/ok-chien.svg" alt="Compatible avec les chiens"/>
    <p>Compatible chiens</p>
    </div>` : ''}
    ${catId["good-with-children"] ? `<div class="compatibility-tag">
    <img src="./images/icones/ok-enfant.svg" alt="Compatible avec les enfants"/>
    <p>Compatible enfants</p>
    </div>` : ''}
       ${catId.outdoor ? `<div class="compatibility-tag">
    <img src="./images/icones/exterieur.svg" alt="Besoin d'un extérieur"/>
    <p>Besoin d'extérieur</p>
    </div>` : ''}
 </div>
 <div>
 </div>
 `
carousel()

}
getCatResume()

const getCatInfo = async () => {
  cats = await fetchCatsData()
 
  const catId = cats.find((element) => element.id === parseInt(pageId,10))

  const personalityTags = []
  for (let i=0; i < catId.traits.length; i+= 1) {
    personalityTags.push(
        `<div class="personality-tags"><p>${catId.traits[i]}</p></div>`
    )
  }

 catInfoContainer.innerHTML = `
    <p>${catId.description}</p>
 `
 tagContainer.innerHTML = `
    <p>${personalityTags.join('')}</p>
 
 `
}

getCatInfo()



export const getAdoptionFeeForCat = (cat, fees) => {
  if (!fees) return { fee: 0, label: "Tarif non disponible" };

  if (cat["special-needs"]) {
    return {
      fee: fees.special.price,
      label: fees.special.label,
      description: fees.special.description || "",
      note: fees.special.note || ""
    };
  }

  const ageKey = cat["age-range"];
  const feeData = fees[ageKey] || {};
  return {
    fee: feeData.price || 0,
    label: feeData.label || "Âge inconnu",
    description: feeData.description || "",
    note: feeData.note || ""
  };
};

let adoptionFees = []

const getAdoptFees = async () => {
    const cats = await fetchCatsData()
    const cat = cats.find((element) => element.id === parseInt(pageId, 10));
    

adoptionFees = await fetchAdoptionFees()
console.log(adoptionFees);

const {fee, label, description, note} = getAdoptionFeeForCat(cat, adoptionFees)
priceContainer.innerHTML= `
<div class="price-card fee">
          <div class="price-card-text">
            <h3>${label}</h3>
            <p>${description}</p>
          </div>
          <div>
            <div class="price-shape-container">
              <img class="shape" src="./images/shape.svg">
              <p class="price bold"> ${fee}€</p>
            </div>
            ${note ? `<p class="bold">${note}</p>` : ""}
          </div>
        </div>
`
}
getAdoptFees()

const getFamily = async () => {
  const cats = await fetchCatsData();
  const cat = cats.find((element) => element.id === parseInt(pageId, 10));
  const family = cat.family
 

  if ( family && family.length > 0) {
    const host = family[0];
      familyContainer.innerHTML = `
  <div class="family-contact"> 
  <h3>${host.firstname} ${host.lastname}</h3>
  <img class="family-img"
    src="./images/family/${host["cover-img"]}"
    alt="${host.firstname} ${host.lastname}" />
  <div class="family-btn-container">
      <div class="family-mail">
          <img  src="./images/icones/mail.svg" alt="mail">
          <div class="family-mail-btn">
              <button id="show-mail" class="button show-btn">Afficher e-mail</button>
              <a href="mailto:${host.email}" id="mail-btn" class="family-btn">${host.email}</a>
          </div>
      </div>
      <div class="family-phone">
          <img src="./images/icones/telephone.svg" alt="téléphone">
          <div class="family-mail-btn">
              <button id="show-phone" class="secondary-button show-btn">Afficher téléphone</button>
              <a href="tel:${host.phone}" id="phone-btn" class="family-btn">${host.phone}</a>
          </div>
      </div>
      </div>
</div>
  <p>${host.description}</p>

  
  `
  } else {
    familyContainer.innerHTML = `
    <p>Aucune famille d'accueil renseignée</p>
    `
  }

   const showMail = document.querySelector('#show-mail')
   const mailBtn = document.querySelector('#mail-btn')
   const showPhone = document.querySelector('#show-phone')
   const phoneBtn = document.querySelector('#phone-btn')

  showMail.addEventListener("click", () => {
    showMail.style.display = "none";
    mailBtn.style.display = "block";
  })

  
  showPhone.addEventListener("click", () => {
    showPhone.style.display = "none";
    phoneBtn.style.display = "block";
  })



  
}

getFamily()

const getFamilyCats = async () => {
  const cats = await fetchCatsData();
  const currentCat = cats.find((element) => element.id === parseInt(pageId, 10));
  const currentFamilyEmail = currentCat.family[0].email;

    if (!currentCat|| !currentCat.family || !currentCat.family[0]) return;

    const relatedCats = cats.filter((cat) => {
      const catFamily = cat.family && cat.family[0]
      return (
        catFamily.email === currentFamilyEmail && cat.id !== currentCat.id 
      );
    })

    .slice(0, 4);

    if (!relatedCatsContainer) return;

    if (relatedCats.length === 0) {
      relatedCatsContainer.innerHTML = `<p> On dirait que ${currentCat.name} est le seul chat dans cette famille d’accueil!</p>`
      return;
    }

    relatedCatsContainer. innerHTML = relatedCats.map(
      (cat) => `
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
                    Z
                " />
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
      `    
    )
    .join("");

    addFav()
}

getFamilyCats();

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
    return -(innerWidth - outerWidth + 100);
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

    const updateButtonsVisibility = () => {
    const outerWidth = slideContainer.offsetWidth;
    const innerWidth = cardContainer.scrollWidth;
    const hasOverflow = innerWidth > outerWidth;

    if (window.innerWidth >= 1024 && hasOverflow) {
      nextBtn.style.display = "block";
      prevBtn.style.display = "block";
    } else {
      nextBtn.style.display = "none";
      prevBtn.style.display = "none";
    }
  };

  
  updateButtonsVisibility();
  window.addEventListener("resize", updateButtonsVisibility);
}

document.addEventListener("DOMContentLoaded", () => {
  initCarousel(".family-card-container");
});

