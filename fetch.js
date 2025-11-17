export const fetchCatsData = async () => {
  try {
    const response = await fetch('./cats.json');

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    return data.cats; 
  } catch (err) {
    console.error("Impossible de charger les chats", err);
    return [];
  }
};

export const fetchCitiesData = async () => {
  try {
    const response = await fetch('./cities.json');

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    return data.cities; 
  } catch (err) {
    console.error("Impossible de charger les villes", err);
    return [];
  }
};

export const fetchAdoptionFees = async () => {
  try {
    const response = await fetch('./adoptionFees.json');

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (err) {
    console.error("Impossible de charger les frais d'adoption", err);
    return [];
  }
};

export const fetchQuestions = async () => {
  try {
    const response = await fetch('./questions.json');

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    return data.questions; 
  } catch (err) {
    console.error("Impossible de charger les questions", err);
    return [];
  }
};
