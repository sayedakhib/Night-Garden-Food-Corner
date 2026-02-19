const recipes = [
  {
    id: 1,
    name: "Upsi Daisy Veg Pulau",
    type: "dinner",
    time: "45 min",
    difficulty: "Medium",
    color: "linear-gradient(135deg, #8db25f, #6f9445)",
    ingredients: [
      "3 onions",
      "2 and half tomato",
      "3 green chilli",
      "2 potato",
      "100 gram green peas",
      "Chicken sukka masala",
      "Garam masala",
      "Maggie masala",
      "Salt (swad anusar)",
      "Gandsala chaval",
      "Cinnamon",
      "Clove",
      "Ghee"
    ],
    steps: [
      "Wash gandsala chaval 2 to 3 times and soak for 15 to 20 minutes.",
      "Slice onions, chop tomato, slit green chilli, and cube potato.",
      "Heat ghee in a cooker or deep pan, then add cinnamon and clove until aromatic.",
      "Add onions and green chilli, and saute until onions turn golden.",
      "Add tomatoes and cook until soft, then mix in potato and green peas.",
      "Add chicken sukka masala, garam masala, maggie masala, and salt (swad anusar).",
      "Add soaked rice and gently stir for 1 minute so masala coats the grains.",
      "Pour water (about 1 paat for 1 paav rice), cover, and cook until rice is fluffy and done.",
      "Rest for 5 minutes, fluff gently, and serve hot.And at last garnish it with fresh coriander leaves."
    ]
  }
];

const recipeGrid = document.getElementById("recipeGrid");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const favOnlyBtn = document.getElementById("favOnlyBtn");
const resultCount = document.getElementById("resultCount");

const recipeDialog = document.getElementById("recipeDialog");
const closeDialog = document.getElementById("closeDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogMeta = document.getElementById("dialogMeta");
const dialogIngredients = document.getElementById("dialogIngredients");
const dialogSteps = document.getElementById("dialogSteps");

const themeBtn = document.getElementById("themeBtn");

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let darkMode = localStorage.getItem("theme") === "dark";
let showFavoritesOnly = false;

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((value) => value !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites();
  renderRecipes();
}

function openRecipeDialog(recipe) {
  dialogTitle.textContent = recipe.name;
  dialogMeta.textContent = `${recipe.type.toUpperCase()} • ${recipe.time} • ${recipe.difficulty}`;

  dialogIngredients.innerHTML = "";
  recipe.ingredients.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    dialogIngredients.appendChild(li);
  });

  dialogSteps.innerHTML = "";
  recipe.steps.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    dialogSteps.appendChild(li);
  });

  recipeDialog.showModal();
}

function renderRecipes() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedType = typeFilter.value;

  const filtered = recipes.filter((recipe) => {
    const matchesType = selectedType === "all" || recipe.type === selectedType;
    const matchesSearch =
      recipe.name.toLowerCase().includes(query) ||
      recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query));
    const matchesFav = !showFavoritesOnly || favorites.includes(recipe.id);

    return matchesType && matchesSearch && matchesFav;
  });

  resultCount.textContent = `${filtered.length} recipe${filtered.length === 1 ? "" : "s"}`;

  if (!filtered.length) {
    recipeGrid.innerHTML = `<div class="empty">No recipes found. Try another search or filter.</div>`;
    return;
  }

  recipeGrid.innerHTML = "";

  filtered.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "card";

    const isFav = favorites.includes(recipe.id);

    card.innerHTML = `
      <div class="card-banner" style="background: ${recipe.color}">${recipe.type.toUpperCase()}</div>
      <div class="card-body">
        <h4 class="card-title">${recipe.name}</h4>
        <div class="meta">
          <span>${recipe.time}</span>
          <span>•</span>
          <span>${recipe.difficulty}</span>
        </div>
        <div class="tags">
          ${recipe.ingredients.slice(0, 3).map((item) => `<span class="tag-chip">${item}</span>`).join("")}
        </div>
        <div class="card-actions">
          <button class="primary-btn" data-action="view" data-id="${recipe.id}">View Recipe</button>
          <button class="small-btn" data-action="fav" data-id="${recipe.id}">${isFav ? "★ Saved" : "☆ Save"}</button>
        </div>
      </div>
    `;

    recipeGrid.appendChild(card);
  });
}

recipeGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  const id = Number(target.dataset.id);
  if (!action || Number.isNaN(id)) return;

  const recipe = recipes.find((item) => item.id === id);
  if (!recipe) return;

  if (action === "fav") {
    toggleFavorite(id);
  }

  if (action === "view") {
    openRecipeDialog(recipe);
  }
});

searchInput.addEventListener("input", renderRecipes);
typeFilter.addEventListener("change", renderRecipes);

favOnlyBtn.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  favOnlyBtn.classList.toggle("active", showFavoritesOnly);
  favOnlyBtn.setAttribute("aria-pressed", String(showFavoritesOnly));
  favOnlyBtn.textContent = showFavoritesOnly ? "Showing Favorites" : "Show Favorites";
  renderRecipes();
});

closeDialog.addEventListener("click", () => recipeDialog.close());
recipeDialog.addEventListener("click", (event) => {
  const rect = recipeDialog.getBoundingClientRect();
  const clickedInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;

  if (!clickedInDialog) {
    recipeDialog.close();
  }
});

function applyTheme() {
  document.body.classList.toggle("dark", darkMode);
  themeBtn.textContent = darkMode ? "☀️" : "🌙";
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}

themeBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  applyTheme();
});

applyTheme();
renderRecipes();
