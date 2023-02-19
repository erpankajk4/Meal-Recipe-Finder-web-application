// nav-bar scrolling effect 
const navE1 = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY >= 56) {
        navE1.classList.add('navbar-scrolled');
    } else if (window.scrollY < 56) {
        navE1.classList.remove('navbar-scrolled');
    }
});
// End of nav-bar scrolling effect 


// Retrieve the favMealList array from localStorage
const favMealList = JSON.parse(localStorage.getItem('favMealList')) || [];

const favMealContainer = document.getElementById('fav-meal-container');

// Function to add all Favorite meals in favMealContainer 
function fetchFavMeals() {
    for (let i = 0; i < favMealList.length; i++) {
        fectchMealById(favMealList[i]);
    }
}
fetchFavMeals();

// Helper Function to Fetch the meal data based on the ID in favMealList
function fectchMealById(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayMealCards(data.meals);
            } else {
                mealCards.innerHTML = '<p>No meals found</p>';
            }
        })
        .catch(error => console.log(error));
}



// Helper function to display meal card on DOM
function displayMealCards(meals) {
    const mealCards = meals.map(createMealCard).join('');
    favMealContainer.insertAdjacentHTML('beforeend', mealCards);
}


// Helper function to create and return a Meal card
function createMealCard(meal) {
    let card = `
    <div class="col-md-4" style="min-width: 250px; max-width: 300px; margin-bottom: 30px;">
    <div class="card-sl" data-id="${meal.idMeal}">
    <div class="card-image">
      <img src="${meal.strMealThumb}" alt = "${meal.strMeal}"/>
    </div>
    <button class="close-btn"><i class="bi bi-x-lg"></i></i></button>
    <div class="card-heading">
      ${meal.strMeal}              
    </div>
    <div class="card-text">
      Country: ${meal.strArea}  <br>
      Category: ${meal.strCategory} <br>
      Price: $${getRandomPrice()} 
    </div>
    <button class="card-button" data-id="${meal.idMeal}" data-bs-toggle="modal" data-bs-target="#mealModal">Get Recipe</button>
        </div>
  </div>
    `;
    return card;
}

// Helper function to generate a random price between $5 and $20
function getRandomPrice() {
    return (Math.floor(Math.random() * 16) + 5).toFixed(2);
}
// End of Function to add all Favorite meals in favMealContainer 



// Function to create Meals Recipe Pop-up container using Bootstrap
const modalElement = document.getElementById('mealModal');
const mealModal = new bootstrap.Modal(modalElement);

favMealContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('card-button')) {
        const mealId = event.target.getAttribute('data-id');
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                const mealModalBody = document.querySelector('#mealModal .modal-body');
                mealModalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                <a href="${meal.strYoutube}" target="_blank"id="youtube"><img src="${meal.strMealThumb}" alt="${meal.strMeal}"></a>
                <h6 class="card-text">${meal.strMeal}</h6>
                <div class="card-text">
                Country: ${meal.strArea}  <br>
                Category: ${meal.strCategory} <br>
                Price: $${getRandomPrice()} 
              </div>
                    <h5 style="text-decoration: underline;">Watch Tutorial</h5>
                    <a href="${meal.strYoutube}" target="_blank"id="youtube"><i class="bi bi-youtube" style="font-size:100px;color:red"></i></a>
                    </div>
                <div class="col-md-6">
                    <h3>${meal.strMeal}</h3>
                    <h5>Instructions</h5>
                    <p>${meal.strInstructions}</p>
                    <h5>Ingredients and Measurements</h5>
                    <ul>
                        ${getIngredientList(meal)}
                    </ul>
                </div>
            </div>
        `;
                mealModal.show();
            })
            .catch(error => console.log(error));
    }
});

// Helper function to get the list of ingredients with its measurements
function getIngredientList(meal) {
    let ingredientList = '';
    for (let i = 1; i <= 20; i++) {
        if (meal['strIngredient' + i]) {
            ingredientList += `<li>${meal['strIngredient' + i]} - ${meal['strMeasure' + i]}</li>`;
        } else {
            break;
        }
    }
    return ingredientList;
}
// End of Function to create Meals Recipe Pop-up container using Bootstrap


// Function to make close button functional
favMealContainer.addEventListener('click', (event) => {
    if (event.target.matches('.close-btn') || event.target.matches('.bi-x-lg')) {
        const card = event.target.closest('.card-sl');
        const id = card.getAttribute('data-id');
        const index = favMealList.indexOf(id);
        if (index > -1) {
            favMealList.splice(index, 1);
            localStorage.setItem('favMealList', JSON.stringify(favMealList));
            card.remove();
            location.reload();  // Reload DOM when card is removed
        }
    }
});
//End of Function to make close button functional

// Event Listener to Reload DOM automatically when card is removed from home page
window.addEventListener('storage', function(event) {
    if (event.storageArea === localStorage) {
      location.reload();
    }
  });
//End of Event Listener to Reload DOM automatically when card is removed from home page