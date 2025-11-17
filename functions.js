export const  burgerMenu = () => {
  const menu = document.getElementById('burger');
  const nav = document.querySelector('.nav-links');
  const links= document.querySelectorAll('.menu-link');
  const main = document.querySelector('main');

  menu.addEventListener('click', () =>{
  nav.classList.toggle('active');
  main.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click',() => {
      nav.classList.toggle('active');
      main.classList.toggle('active');
    });
  });
}

export const addFav = () => {
  document.addEventListener("click", (e) => {
    const container = e.target.closest(".fav-container");
    if (!container) return;

    e.stopPropagation();
    e.preventDefault();

    const fav = container.querySelector(".fav");
    const favAdded = container.querySelector(".fav-full");

    fav.classList.toggle("inactive");
    favAdded.classList.toggle("active");
  });
};
