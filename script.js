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


// Are you Hungry Animation
const text = document.querySelector(".sec-text");

const textLoad = () => {
    setTimeout(() => {
        text.textContent = "Hungry!!";
    }, 0);
    setTimeout(() => {
        text.textContent = "Super Hungry!!";
    }, 4000);
    setTimeout(() => {
        text.textContent = "Super-Dupper Hungry!!";
    }, 8000); //1s = 1000 milliseconds
}
textLoad();
setInterval(textLoad, 12000);
//End of Are you Hungry Animation


// Search Bar Animation and eventlistener
const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("focus", function () {
    this.parentElement.classList.add("active");
    window.scrollTo(0, 500);
});

searchInput.addEventListener("blur", function () {
    if (this.value.length === 0) {
        this.parentElement.classList.remove("active");
    }
});

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchMeal();
        searchInput.value = "";
    }
});
// End of Search Bar Animation and eventlistener


// function to fetch data from the API server and display to DOM
const mealCards = document.getElementById("meals-cards");

function searchMeal() {
    const searchTerm = searchInput.value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
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
    mealCards.innerHTML = meals.map(createMealCard).join('');
}


// Helper function to create and return a Meal card
function createMealCard(meal) {
    let card = `
    <div class="col-md-4" style="min-width: 250px; max-width: 300px; margin-bottom: 30px;">
    <div class="card-sl" data-id="${meal.idMeal}">
    <div class="card-image">
      <img src="${meal.strMealThumb}" alt = "${meal.strMeal}"/>
    </div>
    <button class="card-action"><i class="bi bi-suit-heart-fill"></i></button>
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

// Helper function to generate a random price
function getRandomPrice() {
    return (Math.floor(Math.random() * 16) + 5).toFixed(2);
}
// End of function to fetch data from the API server and display to DOM


// Function to display random meal-cards on DOM
function getMeals() {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=as`)
        .then(response => response.json())
        .then(data => {
            displayMealCards(data.meals);
        })
        .catch(error => console.log(error));
}
getMeals();
//End of Function to display random meal-cards on DOM


// Function to create Meals Recipe Pop-up container using Bootstrap
const modalElement = document.getElementById('mealModal');
const mealModal = new bootstrap.Modal(modalElement);

mealCards.addEventListener('click', (event) => {
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


// function to make favarate button functional and add Event Listener
let favMealList = [];

mealCards.addEventListener('click', (event) => {
    if (event.target.matches('.card-action') || event.target.matches('.bi-suit-heart-fill')) {
        // console.log('Favicon');
        const card = event.target.closest('.card-sl');
        const FavMealId = card.getAttribute('data-id');
        const favicon = card.querySelector('.card-action');

        if (favMealList.includes(FavMealId)) {
            favMealList = favMealList.filter(id => id !== FavMealId);
            favicon.style.color = '#E26D5C';
            favicon.style.background = '#fff';
        } else {
            favMealList.push(FavMealId);
            favicon.style.color = '#fff';
            favicon.style.background = '#E26D5C';
        }
        // Store the updated favMealList in localStorage
        localStorage.setItem('favMealList', JSON.stringify(favMealList));
    }
});
// End of function to make favarate button functional and add Event Listener