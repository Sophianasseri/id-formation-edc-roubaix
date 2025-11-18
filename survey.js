import { burgerMenu } from "./functions.js";
import { fetchQuestions } from "./fetch.js";

burgerMenu()

let currentQuestion = 0;
let questions = [];
let answers = {};

const surveyWrapper = document.querySelector('.survey-wrapper')
const questionContainer = document.querySelector('.question-container')
const summaryContainer = document.querySelector('.summary-container')
const nextBtn = document.querySelector('.nextBtn')
const prevBtn = document.querySelector('.prevBtn')
const surveyTitle = document.querySelector('.survey-title')




const updateProgress = () => {
  const progressFill = document.querySelector(".progress-fill");
  const progressText = document.querySelector(".progress-text");

  const total = questions.length;
  const current = currentQuestion + 1;

  const percent = (current / total) * 100;

  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${current}/${total}`;
}




function showQuestion(index) {
  const question = questions[index];
  surveyTitle.innerText = "Trouvons votre chat idéal";
  if (!question) return;

   nextBtn.style.display = "flex";
  prevBtn.style.display = index === 0 ? "none" : "flex";
  nextBtn.textContent = index === questions.length - 1 ? "Terminer" : "Suivant";

  questionContainer.innerHTML = `
    <h2>${question.question}</h2>
    <div class="options">
      ${
        question.type === "text"
          ? `<form class="" action="" autocomplete="off">
              <div class="search-bar">
                <input id="cityInput" class="search-input" type="text" name="city" placeholder="Entrez une ville" />
                <div class="search-container">
                  <button class="dropdown__toggle" type="button">
                    5 km
                    <img src="./images/icones/chevron.svg" alt="Rechercher un chat" />
                  </button>
                  <ul class="dropdown__menu">
                    <li class="option" role="option">5 km</li>
                    <li class="option" role="option">10 km</li>
                    <li class="option" role="option">15 km</li>
                    <li class="option" role="option">20 km</li>
                    <li class="option" role="option">25 km</li>
                    <li class="option" role="option">30 km</li>
                    <li class="option" role="option">35 km</li>
                    <li class="option" role="option">40 km</li>
                  </ul>
                </div>
              </div>
              <div id="suggestions" class="suggestions"></div>
            </form>`
          : question.options
              .map(
                (opt) => `
                <label class="survey-button">
                  <input type="${question.type}" name="question${question.id}" value="${opt}" ${
                  answers[question.id] === opt ? "checked" : ""
                }>
                  <span class="radio-custom"></span>
                  ${opt}
                </label>
              `
              )
              .join("")
      }
    </div>
  `;

  prevBtn.style.display = index === 0 ? "none" : "flex";
  nextBtn.textContent =
    index === questions.length - 1 ? "Terminer" : "Suivant";
  
  
    nextBtn.disabled = true;

    nextBtn.disabled = true;


if (question.type === "text") {
  const inputText = questionContainer.querySelector("#cityInput");
  if (inputText) {
    inputText.value = answers[question.id] || "";
    nextBtn.disabled = inputText.value.trim() === "";
    inputText.addEventListener("input", () => {
      answers[question.id] = inputText.value.trim();
      nextBtn.disabled = inputText.value.trim() === "";
    });
  }
} else {
  const inputs = questionContainer.querySelectorAll("input");
  inputs.forEach((input) => {
    if (answers[question.id] === input.value) {
      input.checked = true; 
      nextBtn.disabled = false; 
    }
    input.addEventListener("input", () => {
      answers[question.id] = input.value;
      nextBtn.disabled = false;
    });
  });
}


  
  updateProgress();
}



const showSummary = () => {
  surveyWrapper.style.display = "none";
  summaryContainer.style.display = "block";
  surveyTitle.innerText = "Vos réponses";

  summaryContainer.innerHTML = `
    <div class="answers-list">
      ${questions
        .map(
          (q) => `
          <div class="answer-card">
            <p>${q.question} <span class="bold">${answers[q.id] || "Non répondu"}</span></p>
            <button class="edit-btn" data-id="${q.id}">
              <img src="./images/icones/editer.svg" alt="Modifier">
            </button>
          </div>`
        )
        .join("")}
    </div>
    <a class="button" href="./adopt.html">
      Trouver mon chat idéal
    </a>
  `;

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id, 10);
      const questionIndex = questions.findIndex((q) => q.id === id);

      if (questionIndex !== -1) {
        summaryContainer.style.display = "none";
        surveyWrapper.style.display = "block";
        nextBtn.style.display = "flex";
        prevBtn.style.display = questionIndex === 0 ? "none" : "flex";
        currentQuestion = questionIndex;
        showQuestion(currentQuestion);
      }
    });
  });
};

      
const savedProgress = localStorage.getItem("quizProgress");
if (savedProgress) {
  const data = JSON.parse(savedProgress);
  currentQuestion = data.currentQuestion || 0;
  answers = data.answers || {};
  if (data.completed) {
    showSummary();
  } else {
    showQuestion(currentQuestion);
  }
} else {
  showQuestion(currentQuestion);
}

function saveProgress() {
  localStorage.setItem(
    "quizProgress",
    JSON.stringify({
      currentQuestion,
      answers,
      completed: false
    })
  );
}



  

nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    saveProgress()
    showQuestion(currentQuestion);
  } else {
     localStorage.setItem(
      "quizProgress",
      JSON.stringify({
        currentQuestion,
        answers,
        completed: true
      })
    );
    showSummary()
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
});


(async function initQuestionnaire() {
  questions = await fetchQuestions();

  if (questions.length > 0) {
    const savedProgress = localStorage.getItem("quizProgress");

    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      currentQuestion = data.currentQuestion || 0;
      answers = data.answers || {};
      if (data.completed) {
        showSummary();
        return; 
      }
    }

    showQuestion(currentQuestion);
    updateProgress();
  } else {
    questionContainer.innerHTML = `<p>Aucune question trouvée</p>`;
  }
})();